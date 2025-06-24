'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { useEffect, useRef } from "react";

interface TradingViewWidgetProps {
  instrument: string;
}

declare global {
  interface Window {
    TradingView: any;
  }
}

export const TradingViewWidget = ({ instrument }: TradingViewWidgetProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load TradingView script
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      "autosize": true,
      "symbol": `NSE:${instrument}`,
      "interval": "15",
      "timezone": "Asia/Kolkata",
      "theme": "light",
      "style": "1",
      "locale": "en",
      "toolbar_bg": "#f1f3f6",
      "enable_publishing": false,
      "allow_symbol_change": true,
      "container_id": "tradingview_chart",
      "drawings_access": {
        "type": "black",
        "tools": [
          {
            "name": "Regression Trend"
          }
        ]
      },
      "studies": [
        "Volume@tv-basicstudies"
      ],
      "show_popup_button": true,
      "popup_width": "1000",
      "popup_height": "650"
    });

    if (containerRef.current) {
      containerRef.current.appendChild(script);
    }

    return () => {
      if (containerRef.current && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [instrument]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5" />
          <span>{instrument} Chart (15min) with Key Levels</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96 w-full">
          <div 
            ref={containerRef} 
            id="tradingview_chart" 
            className="h-full w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
};
