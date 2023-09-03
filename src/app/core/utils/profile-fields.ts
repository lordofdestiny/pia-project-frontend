import { UserRole } from '@core/models/users';
import { type } from 'os';

export class FieldBase<T> {
    value: T | undefined;
    key: string;
    label: string;
    controlType: string;
    type: string;
    readonly?: boolean;
    autocapitalize?: string;
    options: { key: string; value: string }[];
    flex?: string;
    constructor(
        options: {
            value?: T;
            key?: string;
            label?: string;
            controlType?: string;
            type?: string;
            readonly?: boolean;
            autocapitalize?: string;
            options?: { key: string; value: string }[];
        } = {}
    ) {
        this.value = options.value;
        this.key = options.key ?? '';
        this.label = options.label ?? '';
        this.controlType = options.controlType ?? '';
        this.type = options.type ?? '';
        this.readonly = options.readonly ?? true;
        this.autocapitalize = options.autocapitalize ?? 'off';
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

export const baseFieldConfig = (
    role: Omit<UserRole, 'manager'>,
    renderFor: Omit<UserRole, 'manager'>
): FieldBase<string>[] => {
    const base = [
        new TextboxField({
            key: 'first_name',
            label: 'First Name',
            autocapitalize: 'words',
            type: 'text',
            readonly: role !== renderFor,
        }),
        new TextboxField({
            key: 'last_name',
            label: 'Last Name',
            autocapitalize: 'words',
            type: 'text',
            readonly: role !== renderFor,
        }),
        new TextboxField({
            key: 'email',
            label: 'Email',
            type: 'email',
            readonly: role !== renderFor || role === 'doctor',
        }),
        new TextboxField({
            key: 'username',
            label: 'Username',
            type: 'text',
            readonly: role !== renderFor,
        }),
        new TextboxField({
            key: 'phone',
            label: 'Phone',
            type: 'tel',
            readonly: role !== renderFor,
        }),
    ];

    if (role === 'doctor' || renderFor === 'doctor') {
        base.push(...doctorAdditionalFields(role, renderFor));
    }
    base.push(
        new TextareaField({
            key: 'address',
            label: 'Address',
            type: 'text',
            readonly: role !== renderFor,
        })
    );
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
            readonly: role !== renderFor,
        }),
        new TextboxField({
            key: 'branch',
            label: 'Branch',
            type: 'text',
            readonly: role !== renderFor || role === 'doctor',
        }),
    ];
    base.push(
        new FieldBase({
            key: 'specialization',
            label: 'Specialization',
            type: 'text',
            controlType: renderFor === 'doctor' ? 'dropdown' : 'textbox',
        })
    );
    return base;
};
