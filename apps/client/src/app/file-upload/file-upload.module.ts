import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { DropzoneDirective } from "./dropzone.directive";
import { UploadComponent } from "./components/upload/upload.component";
import { UploadService } from "./services/upload.service";

@NgModule({
	declarations: [UploadComponent, DropzoneDirective],
	providers: [UploadService],
	imports: [SharedModule],
	exports: [UploadComponent]
})
export class FileUploadModule {}
