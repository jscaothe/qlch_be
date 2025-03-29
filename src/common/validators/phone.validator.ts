import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsVietnamesePhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isVietnamesePhoneNumber',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;
          // Kiểm tra số điện thoại Việt Nam (10 số, bắt đầu bằng 0)
          return /^(0[3-9][0-9]{8})$/.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} phải là số điện thoại hợp lệ (VD: 0912345678)`;
        },
      },
    });
  };
} 