import {ElementRef} from "@angular/core";

declare var M: any;

export interface MaterialInstance {
  open(): void,

  close(): void,

  destroy(): void,
}

export class MaterialService {
  static toast(message: string) {
    M.toast({html: message})
  }

  static initializeFloatingButton(ref: ElementRef | undefined) {
    M.FloatingActionButton.init(ref?.nativeElement);
  }

  static updateTextInputs() {
    M.updateTextFields();
  }

  static initModal(ref: ElementRef | undefined): MaterialInstance {
    return M.Modal.init(ref?.nativeElement);
  }

  static initTooltip(ref: ElementRef): MaterialInstance {
    return M.Tooltip.init(ref.nativeElement);
  }

}
