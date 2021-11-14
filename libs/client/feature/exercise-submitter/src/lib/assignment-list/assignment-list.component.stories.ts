import { Meta, moduleMetadata, Story } from "@storybook/angular";
import { AssignmentListComponent, AssignmentListModule } from "./assignment-list.component";

export default {
	title: "AssignmentListComponent",
	component: AssignmentListComponent,
	decorators: [
		moduleMetadata({
			imports: [AssignmentListModule]
		})
	]
} as Meta<AssignmentListComponent>;

const Template: Story<AssignmentListComponent> = (args: AssignmentListComponent) => ({
	component: AssignmentListComponent,
	props: args
});

export const Primary = Template.bind({});
Primary.args = {};
