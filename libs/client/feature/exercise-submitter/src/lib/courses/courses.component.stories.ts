import { Meta, moduleMetadata, Story } from "@storybook/angular";
import { CoursesComponent, CoursesComponentModule } from "./courses.component";

export default {
	title: "CoursesComponent",
	component: CoursesComponent,
	decorators: [
		moduleMetadata({
			imports: [CoursesComponentModule]
		})
	]
} as Meta<CoursesComponent>;

const Template: Story<CoursesComponent> = (args: CoursesComponent) => ({
	component: CoursesComponent,
	props: args
});

export const Primary = Template.bind({});
Primary.args = {
	courses: [
		{
			id: "test-course-1-wise2122",
			shortname: "test-course",
			semester: "wise2122",
			title: "Test-Course: I",
			isClosed: false
		},
		{
			id: "test-course-2-wise2122",
			shortname: "test-course",
			semester: "wise2122",
			title: "Test-Course: II",
			isClosed: false
		},
		{
			id: "test-course-3-wise2122",
			shortname: "test-course",
			semester: "wise2122",
			title: "Test-Course: III",
			isClosed: false
		}
	]
};
