import { switchColor } from '@app/shared/ui/theme';
import { useColorMode } from '@chakra-ui/react';
import React, { useRef, useEffect } from 'react';

import { StyledLineChartCanvas } from './lineChart.style';
import { LineChartCanvasProps } from './lineChart.types';

export const LineChartCanvas: React.FC<LineChartCanvasProps> = ({
  items,
  maxValueY,
  stepsX,
  stepsY,
}) => {
  const { colorMode } = useColorMode();
  const canvasWidth = 280 * 4;
  const canvasHeight = 140 * 4;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const filteredItems = items;

    context.clearRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = switchColor(colorMode).outlineVariant;
    for (let foo = 1; foo < stepsY; foo++) {
      context.fillRect(0, foo * (canvasHeight / stepsY), canvasWidth, 2);
    }
    for (let foo = 1; foo < stepsX; foo++) {
      context.fillRect(foo * (canvasWidth / stepsX), 0, 2, canvasHeight);
    }

    context.fillStyle = switchColor(colorMode).outlineVariant;
    context.fillStyle = switchColor(colorMode).primary;
    context.beginPath();
    context.moveTo(canvasWidth, canvasHeight);
    context.lineTo(0, (canvasWidth + 0.1) >> 0);

    const points = filteredItems.map(item => {
      const x =
        (item.timestamp - filteredItems[0].timestamp) /
        (filteredItems[filteredItems.length - 1].timestamp -
          filteredItems[0].timestamp);
      const y = item.count / maxValueY;
      return {
        x: canvasWidth * x,
        y: canvasHeight - canvasHeight * y,
      };
    });

    // Start at the bottom-left corner
    context.moveTo(0, canvasHeight);

    // Draw line to the first data point on the graph
    context.lineTo(points[0]?.x, points[0]?.y);

    // Use the points to draw a smooth curve
    for (let i = 1; i < points.length - 2; i++) {
      const xc = (points[i].x + points[i + 1].x) / 2;
      const yc = (points[i].y + points[i + 1].y) / 2;
      context.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }

    // Curve through the last two points
    context.quadraticCurveTo(
      points[points.length - 2]?.x,
      points[points.length - 2]?.y,
      points[points.length - 1]?.x,
      points[points.length - 1]?.y,
    );

    context.lineTo(canvasWidth, canvasHeight);
    context.closePath();
    context.fill();
  }, [items, colorMode]);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <StyledLineChartCanvas
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
      $colorMode={colorMode}
    ></StyledLineChartCanvas>
  );
};
