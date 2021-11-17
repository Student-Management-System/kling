import { Meta, moduleMetadata, Story } from "@storybook/angular";
import { StorybookTranslateModule } from "@web-ide/shared/storybook";
import {
	SUBMISSION_RESULT_ACCEPTED_ERROR_WARNING,
	SUBMISSION_RESULT_ACCEPTED_NO_ERRORS,
	SUBMISSION_RESULT_REJECTED
} from "@web-ide/testing";
import { ResultComponent, ResultComponentModule } from "./result.component";

export default {
	title: "ResultComponent",
	component: ResultComponent,
	decorators: [
		moduleMetadata({
			imports: [ResultComponentModule, StorybookTranslateModule]
		})
	]
} as Meta<ResultComponent>;

const Template: Story<ResultComponent> = (args: ResultComponent) => ({
	component: ResultComponent,
	props: args
});

export const WarningAndError = Template.bind({});
WarningAndError.args = {
	result: SUBMISSION_RESULT_ACCEPTED_ERROR_WARNING
};

export const Accepted = Template.bind({});
Accepted.args = {
	result: SUBMISSION_RESULT_ACCEPTED_NO_ERRORS
};

export const Rejected = Template.bind({});
Rejected.args = {
	result: SUBMISSION_RESULT_REJECTED
};
