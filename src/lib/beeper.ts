import { browser } from "$app/environment";
import sound from "./barcode-scanner-beep-sound.mp3";

const audio = browser && new Audio(sound);

export default audio;
