import React, { useMemo } from 'react';
import { Box, Container } from '@material-ui/core';

export interface LayoutCenteredProps {
    direction?: 'column' | 'row';
}

export const LayoutCentered: React.FC<LayoutCenteredProps> = ({ children, direction }) => {
  const realDirection = useMemo(() => direction || 'column', [direction]);

  return (
    <Container>
      <Box
        height="100vh"
        justifyContent="center"
        alignItems="center"
        display="flex"
        flexDirection={realDirection}
      >
        {children}
      </Box>
    </Container>
  );
};
