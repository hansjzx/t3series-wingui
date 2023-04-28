import React, { Fragment } from 'react';
import { transLangKey } from "@wingui";
import { Chip, List, ListItemButton, ListItemText, Typography, Box } from '@mui/material';
import AccordionComponent from "@zionex/wingui-core/src/component/Accordion";

function ValidationAccordion(props) {
  function loadModel(mainLangKey, detailLangKey, errorCount, modelList) {
    const title = (modelList === null || modelList.length <= 0) ? '' :
      `${transLangKey(mainLangKey)} : ${transLangKey(detailLangKey)} ( ${errorCount} )`;
    props.clickValidationList(modelList, title);
  }

  return (
    <Box>
      {
        props.data.map(main => {
          const { validationType: mainValidationType, errorCount } = main;
          const color = (errorCount === 0) ? 'info' : 'error';
          const title = (
            <>
              <Typography sx={{ fontSize: '1rem' }}>{transLangKey(mainValidationType)}</Typography>
              <Chip sx={{ height: '20px', ml: '0.5rem' }} color={color} label={errorCount} />
            </>
          );
          return (
            <AccordionComponent key={mainValidationType} title={title} defaultExpanded>
              {
                <List sx={{ p: '0 !important', border: '1px solid rgba(0, 0, 0, 0.125)', borderRadius: '0.5rem' }}>
                  {
                    main.details.map((detail, index) => {
                      const { validationType, errorCount, models } = detail;
                      const borderBottom = (main.details.length - 1 === index) ? 'none' : '1px solid rgba(0, 0, 0, 0.125)';
                      const color = (errorCount === 0) ? 'info' : 'error';
                      return (
                        <Fragment key={validationType}>
                          <ListItemButton sx={{ p: '0.3rem 1rem !important', borderBottom }} onClick={() => loadModel(mainValidationType, validationType, errorCount, models)}>
                            <ListItemText sx={{ width: '40%' }} primary={transLangKey(validationType)} />
                            <Chip sx={{ height: '20px' }} color={color} label={errorCount} />
                          </ListItemButton>
                        </Fragment>
                      );
                    })
                  }
                </List>
              }
            </AccordionComponent>
          )
        })
      }
    </Box>
  )
}

export default ValidationAccordion;
