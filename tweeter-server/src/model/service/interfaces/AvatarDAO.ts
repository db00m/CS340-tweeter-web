export interface AvatarDAO {
  uploadAvatar(imageBytes: string): Promise<string>
}