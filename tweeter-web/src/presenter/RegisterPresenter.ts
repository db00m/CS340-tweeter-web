import { UserService } from "../model.service/UserService";
import { AuthenticationView } from "./AuthenticationView";
import { Buffer } from "buffer";
import { Dispatch, SetStateAction } from "react";

export type RegisterView = AuthenticationView & {
  setImageUrl: Dispatch<SetStateAction<string>>;
  setImageFileExtension: Dispatch<SetStateAction<string>>;
}

export class RegisterPresenter {
  private _userService: UserService;
  private _view: RegisterView
  private _imageBytes: Uint8Array = new Uint8Array();

  public constructor(view: RegisterView) {
    this._userService = new UserService();
    this._view = view;
  }

  public async doRegister(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageFileExtension: string,
    rememberMe: boolean
  ) {
    try {
      this._view.setIsLoading(true);

      const [user, authToken] = await this._userService.register(
        firstName,
        lastName,
        alias,
        password,
        this._imageBytes,
        imageFileExtension
      );

      this._view.updateUserInfo(user, user, authToken, rememberMe);
      this._view.navigate(`/feed/${user.alias}`);
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to register user because of exception: ${error}`
      );
    } finally {
      this._view.setIsLoading(false);
    }
  };

  public handleImageFile(file: File | undefined) {
    if (file) {
      this._view.setImageUrl(() => URL.createObjectURL(file));

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
        this._view.setImageFileExtension(fileExtension);
      }
    } else {
      this._view.setImageUrl(() => "");
      this._imageBytes = new Uint8Array();
    }
  };

  public getFileExtension(file: File): string | undefined {
    return file.name.split(".").pop();
  };
}