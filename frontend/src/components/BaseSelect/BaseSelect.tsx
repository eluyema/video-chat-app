import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useState } from 'react';
import { SelectWrapper } from './BaseSelect.styled';
import { Paper } from '@mui/material';

interface BaseSelectOptionI {
    name: string;
    value: string;
}

interface BaseSelectI {
    onChange: (param: any) => void;
    label: string;
    options: BaseSelectOptionI[];
    defaultValue?: string;
}

const BaseSelect = ({ onChange, label, defaultValue = "", options }: BaseSelectI) => {
    const [value, setValue] = useState(defaultValue);

    const handleChange = (event: SelectChangeEvent) => {
        setValue(event.target.value as string)
        onChange(event.target.value);
    }

    return <SelectWrapper fullWidth variant="outlined">
    <InputLabel variant='filled'>{label}</InputLabel>
    <Select
      variant="filled"
      color="info"
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      value={value}
      label={label}
      MenuProps={{
        anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          }}
      }
      
      onChange={handleChange}
    >
      {options.map(({value, name })=>(<MenuItem value={value}>{name}</MenuItem>))}
    </Select>
  </SelectWrapper>
}

export default BaseSelect;
