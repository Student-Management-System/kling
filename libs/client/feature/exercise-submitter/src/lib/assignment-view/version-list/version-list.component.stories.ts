import { Meta, moduleMetadata, Story } from "@storybook/angular";
import { StorybookTranslateModule } from "@web-ide/shared/storybook";
import { VERSION_LIST } from "@web-ide/testing";
import { VersionListComponent, VersionListModule } from "./version-list.component";

export default {
	title: "VersionListComponent",
	component: VersionListComponent,
	decorators: [
		moduleMetadata({
			imports: [VersionListModule, StorybookTranslateModule]
		})
	]
} as Meta<VersionListComponent>;

const Template: Story<VersionListComponent> = (args: VersionListComponent) => ({
	component: VersionListComponent,
	props: args
});

export const Default = Template.bind({});
Default.args = {
	versions: VERSION_LIST.map(v => ({
		...v,
		date: new Date(v.timestamp * 1000)
	})),
	isLoading: false
};

export const Empty = Template.bind({});
Empty.args = {
	versions: [],
	isLoading: false
};

export const Loading = Template.bind({});
Loading.args = {
	versions: VERSION_LIST.map(v => ({
		...v,
		date: new Date(v.timestamp * 1000)
	})),
	isLoading: true
};
