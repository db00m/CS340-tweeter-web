import { UserService } from "../model.service/UserService";
import { Buffer } from "buffer";
import { Dispatch, SetStateAction } from "react";
import { AuthenticationPresenter, AuthenticationView } from "./AuthenticationPresenter";

export interface RegisterView extends AuthenticationView {
  setImageUrl: Dispatch<SetStateAction<string>>;
  setImageFileExtension: Dispatch<SetStateAction<string>>;
}

export class RegisterPresenter extends AuthenticationPresenter<RegisterView> {
  private _userService: UserService;
  private _imageBytes: Uint8Array = new Uint8Array();

  public constructor(view: RegisterView) {
    super(view);
    this._userService = new UserService();
  }

  public async doRegister(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageFileExtension: string,
    rememberMe: boolean
  ) {
    await this.doAuthOperation(async () => {
      return this._userService.register(
        firstName,
        lastName,
        alias,
        password,
        this._imageBytes,
        imageFileExtension
      );
    },
      (alias: string) => {
        this.view.navigate(`/feed/${alias}`);
      }, rememberMe, "register user");
  };

  public handleImageFile(file: File | undefined) {
    if (file) {
      this.view.setImageUrl(() => URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        // Remove unnecessary file metadata from the start of the string.
        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];

        this._imageBytes = Buffer.from(
          imageStringBase64BufferContents,
          "base64"
        );
      };
      reader.readAsDataURL(file);

      // Set image file extension (and move to a separate method)
      const fileExtension = this.getFileExtension(file);
      if (fileExtension) {
        this.view.setImageFileExtension(fileExtension);
      }
    } else {
      this.view.setImageUrl(() => "");
      this._imageBytes = new Uint8Array();
    }
  };

  public getFileExtension(file: File): string | undefined {
    return file.name.split(".").pop();
  };
}