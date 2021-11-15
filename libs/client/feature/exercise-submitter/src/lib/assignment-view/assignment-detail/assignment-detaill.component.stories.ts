import { Meta, moduleMetadata, Story } from "@storybook/angular";
import {
	AssignmentDetailComponent,
	AssignmentDetailComponentModule
} from "./assignment-detail.component";
import { ASSIGNMENT_INPROGRESS_GROUP, GROUP_JAVA001 } from "@web-ide/testing";
import { StorybookTranslateModule } from "@web-ide/shared/storybook";

export default {
	title: "AssignmentDetailComponent",
	component: AssignmentDetailComponent,
	decorators: [
		moduleMetadata({
			imports: [AssignmentDetailComponentModule, StorybookTranslateModule]
		})
	]
} as Meta<AssignmentDetailComponent>;

const Template: Story<AssignmentDetailComponent> = (args: AssignmentDetailComponent) => ({
	component: AssignmentDetailComponent,
	props: args
});

export const Default = Template.bind({});
Default.args = {
	assignment: ASSIGNMENT_INPROGRESS_GROUP,
	group: GROUP_JAVA001
};

export const WithoutEndDate = Template.bind({});
WithoutEndDate.args = {
	assignment: {
		...ASSIGNMENT_INPROGRESS_GROUP,
		endDate: undefined
	},
	group: GROUP_JAVA001
};

export const WithoutGroup = Template.bind({});
WithoutGroup.args = {
	assignment: ASSIGNMENT_INPROGRESS_GROUP,
	group: undefined
};

export const SubmissionDisabled = Template.bind({});
SubmissionDisabled.args = {
	assignment: {
		...ASSIGNMENT_INPROGRESS_GROUP,
		state: "IN_REVIEW"
	}
};
