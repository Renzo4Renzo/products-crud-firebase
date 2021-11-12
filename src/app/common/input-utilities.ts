export class InputUtilities {
  allowKeyDown(event: any): boolean {
    return (
      event.keyCode !== 69 && //eE
      event.keyCode !== 109 && //-
      event.keyCode !== 189 && //-
      event.keyCode !== 107 && //+
      event.keyCode !== 187 //+
    );
  }
}
