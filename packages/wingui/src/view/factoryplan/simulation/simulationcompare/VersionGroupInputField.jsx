import React from "react";
import {
  Box, Checkbox, Chip, FormControl, InputLabel, ListItemIcon, ListItemText, ListSubheader, MenuItem, Select
} from "@mui/material";
import { Cancel } from "@mui/icons-material";
import { useFloatInputStyles } from "@zionex/wingui-core/src/common/imports";
import { Controller } from "react-hook-form";

function VersionGroupInputField(props) {
  const classes = useFloatInputStyles(props);

  function handleToggle(onChange, value, name) {
    value = value ? value : [];
    const isChecked = (value, name) => {
      value = value ? value : [];
      return value.indexOf(name) > -1;
    }
    if (isChecked(value, name)) {
      onChange(value.filter(i => i !== name));
    } else {
      onChange([...value, name]);
    }
  }
  
  function findVersion(versionCd) {
    return Object.values(props.data).flat().find(version => version.versionCd === versionCd);
  }
  
  return (
    <Box className={classes.div} style={{ minWidth: '440px' }}>
      <Controller render={({ field: { onChange, value } }) => (
        <FormControl
          variant="filled"
          size="small"
          fullWidth
          className={classes.select}
        >
          <InputLabel>{props.label}</InputLabel>
          <Select displayEmpty multiple disableUnderline
                  value={value ? value : []}
                  MenuProps={{
                    anchorOrigin: {
                      vertical: "bottom",
                      horizontal: "center"
                    },
                    transformOrigin: {
                      vertical: "top",
                      horizontal: "center"
                    },
                  }}
                  onChange={onChange}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {selected.map((val) => (
                        <Chip
                          clickable
                          size="small"
                          key={'chip-' + val}
                          label={val}
                          onDelete={(e) => onChange(value.filter((v) => v !== val))}
                          deleteIcon={
                            <Cancel onMouseDown={(event) => event.stopPropagation()} />
                          }
                        />
                      ))}
                    </Box>
                  )}
          >
            {
              Object.keys(props.data).map(mainVersion =>
                [
                  <ListSubheader sx={{ fontWeight: 'bold', lineHeight: '40px', color: '#595959', fontSize: 15, borderBottom: '1px solid #dddddd' }}>{mainVersion}</ListSubheader>,
                  props.data[mainVersion].map(version => {
                      let versionData = findVersion(props.getValues('versionCd')[0]);
                      const disabled = (props.getValues('versionCd').length > 0 && (versionData.mainVersionCd !== version.mainVersionCd || (versionData.stepCd !== version.stepCd || versionData.stepSeq !== version.stepSeq)))
                      || (props.getValues('versionCd').length === 5 && !props.getValues('versionCd').includes(version.versionCd));
                      return (
                        <MenuItem disabled={disabled} key={version.versionCd} value={version.versionCd} onClick={() => handleToggle(onChange, value, version.versionCd)}>
                          <ListItemIcon>
                            <Checkbox
                              key={'check-' + version.versionCd}
                              label={version.versionCd}
                              checked={value && value.indexOf(version.versionCd) > -1}
                              onChange={(event, checked) => {
                                if (checked) {
                                  onChange([...value, version.versionCd]);
                                } else {
                                  onChange(value.filter(value => value !== version.versionCd));
                                }
                              }}
                            />
                          </ListItemIcon>
                          <ListItemText primary={`${version.versionCd} : ${version.descripText ? version.descripText : ''}`} />
                        </MenuItem>
                      )
                    }
                  )
                ]
              )
            }
          </Select>
        </FormControl>
        )}
                  control={props.control}
                  name="versionCd"
      />
    </Box>
  );
}

export default VersionGroupInputField;
