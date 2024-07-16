/**
 * 验证邮箱
 */
export const validateEmail = (email: string) => {
    const emailRegex = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z]{2,4})+$/;
    if (emailRegex.test(email)) {
        return true;
    } else {
        return false;
    }
}