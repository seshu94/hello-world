import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { gql, executeMutation } from 'lightning/graphql';

const CREATE_ACCOUNT_MUTATION = gql`
    mutation CreateAccount($input: AccountCreateInput!) {
        uiapi {
            AccountCreate(input: $input) {
                Record {
                    Id
                    Name {
                        value
                    }
                    AccountNumber {
                        value
                    }
                    Phone {
                        value
                    }
                    Website {
                        value
                    }
                    Industry {
                        value
                    }
                }
            }
        }
    }
`;

const EMPTY_FORM = {
    Name: '',
    AccountNumber: '',
    Phone: '',
    Website: '',
    Industry: ''
};

export default class AccountDetails extends LightningElement {
    formData = { ...EMPTY_FORM };
    createdAccount;
    errorMessage = '';
    isSaving = false;

    handleChange(event) {
        const { name, value } = event.target;
        this.formData = {
            ...this.formData,
            [name]: value
        };
    }

    async handleSubmit() {
        if (!this.validateInputs()) {
            return;
        }

        this.isSaving = true;
        this.errorMessage = '';
        this.createdAccount = undefined;

        try {
            const { data, errors } = await executeMutation({
                query: CREATE_ACCOUNT_MUTATION,
                variables: {
                    input: this.buildInput()
                },
                operationName: 'CreateAccount'
            });

            if (errors?.length) {
                throw new Error(this.reduceErrors(errors));
            }

            const record = data?.uiapi?.AccountCreate?.Record;

            this.createdAccount = {
                id: record?.Id || '',
                name: record?.Name?.value || 'Not available',
                accountNumber: record?.AccountNumber?.value || 'Not available',
                phone: record?.Phone?.value || 'Not available',
                website: record?.Website?.value || 'Not available',
                industry: record?.Industry?.value || 'Not available'
            };

            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Account created successfully.',
                    variant: 'success'
                })
            );

            this.formData = { ...EMPTY_FORM };
        } catch (error) {
            this.errorMessage = error.message || 'Unable to create the account.';
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error creating account',
                    message: this.errorMessage,
                    variant: 'error'
                })
            );
        } finally {
            this.isSaving = false;
        }
    }

    handleReset() {
        this.formData = { ...EMPTY_FORM };
        this.errorMessage = '';
    }

    validateInputs() {
        const inputs = [...this.template.querySelectorAll('lightning-input')];
        return inputs.reduce((isValid, input) => {
            input.reportValidity();
            return isValid && input.checkValidity();
        }, true);
    }

    buildInput() {
        const accountFields = Object.entries(this.formData).reduce((input, [fieldName, value]) => {
            if (value) {
                input[fieldName] = value;
            }

            return input;
        }, {});

        return {
            Account: accountFields
        };
    }

    reduceErrors(errors) {
        return errors.map((item) => item.message).join(', ');
    }
}
