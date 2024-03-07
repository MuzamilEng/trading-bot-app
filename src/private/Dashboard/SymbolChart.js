import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

/**
 * props:
 * - symbol
 */
function SymbolChart(props) {
    // console.log(props?.symbol, "SymbolChart");

    const [widget, setWidget] = useState();

    useEffect(() => {
        if (!props.symbol) return;

        setWidget(`
<div class="tradingview-widget-container">
  <div style="border-radius:10px;" class="tradingview-widget-container__widget"></div>
  <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js" async>
  {
  "symbol": "BINANCE:${props.symbol}",
  "width": "100%",
  "height": "100%",
  "locale": "br",
  "dateRange": "1D",
  "colorTheme": "dark",
  "trendLineColor": "rgba(41, 98, 255, 1)",
  "underLineColor": "rgba(41, 98, 255, 0.3)",
  "underLineBottomColor": "rgba(41, 98, 255, 0)",
  "isTransparent": false,
  "autosize": true,
  "largeChartUrl": "return false;"
}
  </script>
  <style>body { background-color: #000; pointer-events: none; } </style>
</div>
        `);
    }, [props.symbol])

    return (
        <WebView
            containerStyle={styles.chart}
            style={styles.bugfixAndroid}
            originWhitelist={['*']}
            source={{ html: widget }} />
    )
}

const styles = StyleSheet.create({
    chart: {
        flex: 0,
        width: '100%',
        height: 200
    },
    bugfixAndroid: {
        opacity: 0.99,
        overflow: 'hidden'
    }
})

export default SymbolChart;