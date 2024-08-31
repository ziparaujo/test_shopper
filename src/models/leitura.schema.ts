import { Schema } from "mongoose";
import { ILeitura } from './leitura.interface';

const base64Regex = /^([0-9a-zA-Z+/]{4})*([0-9a-zA-Z+/]{2}==|[0-9a-zA-Z+/]{3}=)?$/;

const leituraSchema = new Schema<ILeitura>({
  image: { 
    type: String, 
    validate: {
      validator: (value: string): boolean => base64Regex.test(value),
      message: (props: { value: string }) => `${props.value} is not a valid base64 string.`
    },
    required: [true, "Image is required."]
  },
  customer_code: { type: String, required: true },
  measure_datetime: { 
    type: Date,
    validate: {
      validator: (value: Date): boolean => !isNaN(value.getTime()),
      message: (props: { value: Date }) => `${props.value} is not a valid date.`
    },
    required: [true, "Measure datetime is required."] 
  },
  measure_type: { 
    type: String,
    enum: {
      values: ["WATER", "GAS"],
      message: "{VALUE} is not supported. Valid options are WATER or GAS."
    },
    required: [true, "Measure type is required."]
  },
  has_confirmed: { type: Boolean },
  image_url: { type: String }
}, { versionKey: false });

export default leituraSchema;
