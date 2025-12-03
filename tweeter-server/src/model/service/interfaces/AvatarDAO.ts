export interface AvatarDAO {
  uploadAvatar(imageBytes: string, fileExtension: string, fileName: string): Promise<string>
}