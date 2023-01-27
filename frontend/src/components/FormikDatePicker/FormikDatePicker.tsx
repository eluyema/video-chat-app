import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { FormikProps } from 'formik';
import { SessionCreateData } from '../../common/types/sessions';
import { TextField } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';

interface FormikDatePickerProps {
    formik: FormikProps<any>;
    fieldName: string;
    displayName: string;
}

const FormikDatePicker = ({ formik, fieldName, displayName }: FormikDatePickerProps) => {
    const { errors, handleSubmit, touched, values, setFieldValue } = formik;

    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateTimePicker
            onChange={(value) => setFieldValue(fieldName, value, true)}
            value={values.plannedDate}
            label={displayName}
            renderInput={(params) => (
                <TextField
                    error={Boolean((fieldName in errors) && errors[fieldName])}
                    helperText={fieldName in touched && fieldName in errors && String(errors[fieldName])}
                    margin="normal"
                    name={fieldName}
                    fullWidth
                    {...params}
                />
            )}
        />
      </LocalizationProvider>
    )
}

export default FormikDatePicker;