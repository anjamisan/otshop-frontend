import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filePreview',
  standalone: true // so you can import it directly into your component
})
export class FilePreviewPipe implements PipeTransform {
  transform(file: File): string {
    return URL.createObjectURL(file);
  }
}
