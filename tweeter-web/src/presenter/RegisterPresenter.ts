import { UserService } from "../model.service/UserService";
import { AuthenticationView } from "./AuthenticationView";
import { Buffer } from "buffer";
import { Dispatch, SetStateAction } from "react";
import { Presenter } from "./Presenter";

export interface RegisterView extends AuthenticationView {
  setImageUrl: Dispatch<SetStateAction<string>>;
  setImageFileExtension: Dispatch<SetStateAction<string>>;
}

export class RegisterPresenter extends Presenter<RegisterView> {
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
    this.view.setIsLoading(true);

    await this.doFailureReportingOperation(async () => {
      const [user, authToken] = await this._userService.register(
        firstName,
        lastName,
        alias,
        password,
        this._imageBytes,
        imageFileExtension
      );

      this.view.updateUserInfo(user, user, authToken, rememberMe);
      this.view.navigate(`/feed/${user.alias}`);
    }, "register user");

    this.view.setIsLoading(false);

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