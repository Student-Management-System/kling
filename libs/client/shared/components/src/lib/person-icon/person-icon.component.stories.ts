import { Meta, moduleMetadata, Story } from "@storybook/angular";
import { PersonIconComponent, PersonIconComponentModule } from "./person-icon.component";

export default {
	title: "PersonIconComponent",
	component: PersonIconComponent,
	decorators: [
		moduleMetadata({
			imports: [PersonIconComponentModule]
		})
	]
} as Meta<PersonIconComponent>;

const Template: Story<PersonIconComponent> = (args: PersonIconComponent) => ({
	component: PersonIconComponent,
	props: args
});

export const Primary = Template.bind({});
Primary.args = {
	name: "Max Mustermann"
};
