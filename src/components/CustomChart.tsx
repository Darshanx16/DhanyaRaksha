import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Circle, Rect, Text as SvgText, G } from 'react-native-svg';

interface CustomChartProps {
  data: number[];
  labels?: string[];
  color: string;
  fillColor?: string;
  height?: number;
  width?: number;
  suffix?: string;
}

export const CustomChart: React.FC<CustomChartProps> = ({
  data,
  labels = [],
  color,
  fillColor,
  height = 100,
  width = Dimensions.get('window').width - 48,
  suffix = '',
}) => {
  if (!data || data.length === 0) return null;

  const minVal = Math.min(...data);
  const maxVal = Math.max(...data);
  const valRange = maxVal - minVal === 0 ? 1 : maxVal - minVal;

  const paddingLeft = 35;
  const paddingRight = 10;
  const paddingTop = 15;
  const paddingBottom = 20;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Compute points
  const points = data.map((val, index) => {
    const x = paddingLeft + (index / (data.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - ((val - minVal) / valRange) * chartHeight;
    return { x, y, val };
  });

  // Generate SVG paths
  let linePath = '';
  let areaPath = '';

  if (points.length > 0) {
    linePath = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      linePath += ` L ${points[i].x} ${points[i].y}`;
    }

    if (fillColor) {
      areaPath = `${linePath} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`;
    }
  }

  // Y-axis grid values
  const yTicks = [minVal, minVal + valRange / 2, maxVal];

  return (
    <View style={{ width, height, justifyContent: 'center', alignItems: 'center' }}>
      <Svg width={width} height={height}>
        {/* Horizontal Grid Lines & Y Labels */}
        {yTicks.map((tick, idx) => {
          const y = paddingTop + chartHeight - ((tick - minVal) / valRange) * chartHeight;
          return (
            <G key={`grid-${idx}`}>
              <Path
                d={`M ${paddingLeft} ${y} L ${width - paddingRight} ${y}`}
                stroke="#E5E7EB"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
              <SvgText
                x={paddingLeft - 8}
                y={y + 4}
                fontSize={9}
                fill="#9CA3AF"
                textAnchor="end"
              >
                {tick.toFixed(1)}{suffix}
              </SvgText>
            </G>
          );
        })}

        {/* Shaded Area under the Line */}
        {fillColor && areaPath ? (
          <Path d={areaPath} fill={fillColor} />
        ) : null}

        {/* Trend Line */}
        {linePath ? (
          <Path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : null}

        {/* Data points (Circles) */}
        {points.map((pt, idx) => (
          <Circle
            key={`dot-${idx}`}
            cx={pt.x}
            cy={pt.y}
            r={3}
            fill="#FFFFFF"
            stroke={color}
            strokeWidth={2}
          />
        ))}

        {/* X Labels */}
        {labels.map((lbl, idx) => {
          const pt = points[idx];
          if (!pt) return null;
          return (
            <SvgText
              key={`lbl-${idx}`}
              x={pt.x}
              y={height - 4}
              fontSize={9}
              fill="#9CA3AF"
              textAnchor="middle"
            >
              {lbl}
            </SvgText>
          );
        })}
      </Svg>
    </View>
  );
};

export default CustomChart;
