import { UserRole } from '@core/models/users';
import { type } from 'os';

export class FieldBase<T> {
    value: T | undefined;
    key: string;
    label: string;
    controlType: string;
    type: string;
    autocapitalize?: string;
    autocomplete?: string;
    options: any[];
    flex?: string;
    constructor(
        options: {
            value?: T;
            key?: string;
            label?: string;
            controlType?: string;
            type?: string;
            autocapitalize?: string;
            autocomplete?: string;
            options?: { key: string; value: string }[];
        } = {}
    ) {
        this.value = options.value;
        this.key = options.key ?? '';
        this.label = options.label ?? '';
        this.controlType = options.controlType ?? '';
        this.type = options.type ?? '';
        this.autocapitalize = options.autocapitalize ?? 'off';
        this.autocomplete = options.autocomplete ?? 'off';
        this.options = options.options ?? [];
    }
}

export class TextboxField extends FieldBase<string> {
    override controlType = 'textbox';
}

export class DropdownField extends FieldBase<string> {
    override controlType = 'dropdown';
}

export class TextareaField extends FieldBase<string> {
    override controlType = 'textarea';
}

export class ImageField extends FieldBase<File> {
    override controlType = 'image';
}

export const baseFieldConfig = (
    role: Omit<UserRole, 'manager'>,
    renderFor: Omit<UserRole, 'manager'>
): FieldBase<any>[] => {
    const base = [
        new TextboxField({
            key: 'first_name',
            label: 'First Name',
            autocapitalize: 'words',
            type: 'text',
        }),
        new TextboxField({
            key: 'last_name',
            label: 'Last Name',
            autocapitalize: 'words',
            type: 'text',
        }),
        new TextboxField({
            key: 'email',
            label: 'Email',
            type: 'email',
        }),
        new TextboxField({
            key: 'username',
            label: 'Username',
            type: 'text',
        }),
        new TextboxField({
            key: 'phone',
            label: 'Phone',
            type: 'tel',
        }),
        new TextareaField({
            key: 'address',
            label: 'Address',
            type: 'text',
        }),
    ];

    if (role === 'doctor' || renderFor === 'doctor') {
        base.push(...doctorAdditionalFields(role, renderFor));
    }
    return base;
};

const doctorAdditionalFields = (
    role: Omit<UserRole, 'manager'>,
    renderFor: Omit<UserRole, 'manager'>
): FieldBase<string>[] => {
    const base = [
        new TextboxField({
            key: 'licence_number',
            label: 'Licence Number',
            type: 'text',
        }),
        new TextboxField({
            key: 'branch',
            label: 'Branch',
            type: 'text',
        }),
        new DropdownField({
            key: 'specialization',
            label: 'Specialization',
            type: 'text',
        }),
    ];
    return base;
};
