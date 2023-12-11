export const validateField = (value, fieldName, minLength, maxLength, allowEmpty = false) => {
    const errors = {}
  
    if (!allowEmpty && !value.trim()) {
        errors[fieldName] = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`
    } else if (value.length < minLength && value.length !== 0) {
        errors[fieldName] = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be more than ${minLength} characters`
    } else if (value.length > maxLength && value.length !== 0) {
        errors[fieldName] = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be less than ${maxLength} characters`
    }
  
    return errors
}