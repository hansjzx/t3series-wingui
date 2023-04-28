import React from 'react';
import { Card, CardActions, CardContent, CardHeader } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { transLangKey } from '@wingui';

const useCardStyles = makeStyles({
  card: {
    height: '100%',
    borderRadius: 6,
    border: 'none',
    boxShadow: 'rgb(90 114 123 / 11%) 0px 7px 30px 0px, rgb(0 0 0 / 5%) 0px 1px 3px -1px',
    '& > div': {
      paddingRight: '1rem',
      paddingLeft: '1rem'
    },
    '& > div:first-child': {
      paddingTop: '1rem',
      paddingBottom: '0'
    },
    '& > div:last-child': {
      paddingBottom: '1rem'
    },
    '& .MuiCardHeader-root': {
      '& .MuiCardHeader-content': {
        height: 30
      },
      '& .MuiCardHeader-action': {
        marginTop: 0,
        marginRight: 0
      }
    },
    
  }
});

const Details = ({ id, title, headerAction, children, style, footerAction, titleTypographyProps, innerRef }) => {
  const classes = useCardStyles();
  const defaultHeight = { height: 'calc(100% - 46px)' };
  const contentStyle = { ...defaultHeight, ...style };
  return (
    <Card id={id} variant="outlined" className={classes.card} ref={innerRef}>
      {(title || headerAction) && <CardHeader title={transLangKey(title)} action={headerAction} titleTypographyProps={titleTypographyProps} />}
      <CardContent sx={contentStyle}>
        {children}
      </CardContent>
      {footerAction &&
        <CardActions sx={{ padding: '0 1rem 1rem' }}>
          {footerAction}
        </CardActions>
      }
    </Card>
  );
};

export default Details;
