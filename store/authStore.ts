import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { User, Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

interface AuthState {
  user: User | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
  sessionDate: string | null // YYYY-MM-DD format of when session started
  
  // Actions
  setUser: (user: User | null) => void
  setSession: (session: Session | null) => void
  setLoading: (loading: boolean) => void
  logout: () => Promise<void>
  checkAndHandleSessionExpiry: () => boolean
  initializeAuth: () => Promise<void>
}

// Get current date in IST as YYYY-MM-DD
function getISTDateString(): string {
  const now = new Date()
  // Convert to IST (UTC+5:30)
  const istOffset = 5.5 * 60 * 60 * 1000
  const utc = now.getTime() + (now.getTimezoneOffset() * 60 * 1000)
  const istTime = new Date(utc + istOffset)
  
  return istTime.toISOString().split('T')[0]
}

// Check if a date is different from current IST date
function isDifferentDay(storedDate: string | null): boolean {
  if (!storedDate) return true
  return storedDate !== getISTDateString()
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      isLoading: true,
      isAuthenticated: false,
      sessionDate: null,

      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user 
      }),

      setSession: (session) => {
        const today = getISTDateString()
        set({ 
          session, 
          sessionDate: today,
          isAuthenticated: !!session 
        })
      },

      setLoading: (isLoading) => set({ isLoading }),

      logout: async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        set({ 
          user: null, 
          session: null, 
          isAuthenticated: false,
          sessionDate: null 
        })
      },

      // Check if session should be expired (different day in IST)
      // Returns true if expired and was cleared
      checkAndHandleSessionExpiry: () => {
        const { sessionDate, session } = get()
        
        if (!session) {
          return true // No session, considered expired
        }

        const isExpired = isDifferentDay(sessionDate)
        
        if (isExpired) {
          // Session expired - clear it
          set({ 
            user: null, 
            session: null, 
            isAuthenticated: false,
            sessionDate: null 
          })
          return true
        }
        
        return false
      },

      // Initialize auth state on app load
      initializeAuth: async () => {
        set({ isLoading: true })
        
        try {
          const supabase = createClient()
          const { data: { session }, error } = await supabase.auth.getSession()
          
          if (error) {
            console.error('Auth initialization error:', error)
            set({ isLoading: false })
            return
          }

          if (session) {
            // Check if session expired (different day)
            const { checkAndHandleSessionExpiry, setUser, setSession } = get()
            const isExpired = checkAndHandleSessionExpiry()
            
            if (!isExpired) {
              const { data: { user } } = await supabase.auth.getUser()
              setUser(user)
              setSession(session)
            }
          }
        } catch (error) {
          console.error('Auth initialization error:', error)
        } finally {
          set({ isLoading: false })
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user, 
        session: state.session,
        isAuthenticated: state.isAuthenticated,
        sessionDate: state.sessionDate
      }),
    }
  )
)
