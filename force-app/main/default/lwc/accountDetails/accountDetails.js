import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';

import NAME_FIELD from '@salesforce/schema/Account.Name';
import ACCOUNT_NUMBER_FIELD from '@salesforce/schema/Account.AccountNumber';
import PHONE_FIELD from '@salesforce/schema/Account.Phone';
import WEBSITE_FIELD from '@salesforce/schema/Account.Website';
import INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';

const FIELDS = [
    NAME_FIELD,
    ACCOUNT_NUMBER_FIELD,
    PHONE_FIELD,
    WEBSITE_FIELD,
    INDUSTRY_FIELD
];

export default class AccountDetails extends LightningElement {
    @api recordId;

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    account;

    get name() {
        return getFieldValue(this.account.data, NAME_FIELD) || 'Not available';
    }

    get accountNumber() {
        return getFieldValue(this.account.data, ACCOUNT_NUMBER_FIELD) || 'Not available';
    }

    get phone() {
        return getFieldValue(this.account.data, PHONE_FIELD) || 'Not available';
    }

    get website() {
        return getFieldValue(this.account.data, WEBSITE_FIELD) || 'Not available';
    }

    get industry() {
        return getFieldValue(this.account.data, INDUSTRY_FIELD) || 'Not available';
    }

    get error() {
        return this.account.error;
    }
}
