import { LayoutModule } from "@angular/cdk/layout";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { BrowserModule } from "@angular/platform-browser";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { Meta, moduleMetadata, Story } from "@storybook/angular";
import { ClientStateModule } from "@web-ide/client/data-access/state";
import { ToastService } from "@web-ide/client/shared/services";
import { ToastrModule } from "ngx-toastr";
import { ExerciseSubmitterComponent } from "./exercise-submitter.component";

export function createTranslateLoader(http: HttpClient): TranslateLoader {
	return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

export default {
	title: "ExerciseSubmitterComponent",
	component: ExerciseSubmitterComponent,
	decorators: [
		moduleMetadata({
			imports: [
				BrowserModule,
				HttpClientModule,
				TranslateModule.forRoot({
					defaultLanguage: localStorage.getItem("language") ?? "en",
					loader: {
						provide: TranslateLoader,
						useFactory: createTranslateLoader,
						deps: [HttpClient]
					}
				}),
				ToastrModule.forRoot({
					positionClass: "toast-bottom-right",
					progressBar: true
				}),
				LayoutModule,
				ClientStateModule
			],
			providers: [ToastService]
		})
	]
} as Meta<ExerciseSubmitterComponent>;

const Template: Story<ExerciseSubmitterComponent> = (args: ExerciseSubmitterComponent) => ({
	component: ExerciseSubmitterComponent,
	props: args
});

export const Primary = Template.bind({});
Primary.args = {};
