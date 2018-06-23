const supportCharOrDigiOrUnderline = function () {
  return {
    pattern: /^[a-zA-Z_0-9]+$/,
    message: '用户名只能包含字母、数字或_下划线'
  }
}

const checkPasswordValidator = function (pwd) {
  return {
    validator: function (rule, value, cb) {
      !value ? cb('请再次输入密码') : (value !== pwd ? cb('两次输入密码不一致') : cb()) // eslint-disable-line
    }
  }
}

const notEmpty = function (label) {
  return {
    required: true,
    message: `* ${label}必填`,
    trigger: 'blur'
  }
}

const emailValidator = function () {
  return {
    pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
    message: '邮箱格式不正确',
    trigger: 'blur'
  }
}

const minLength = function (min) {
  return {
    min,
    message: `长度至少为${min}位`
  }
}

const maxLength = function (max) {
  return {
    max,
    message: `长度最大为${max}位`
  }
}

const requireCharacter = function () {
  return {
    pattern: /[a-zA-Z]/,
    message: '必须包含字母'
  }
}

const requireDigit = function () {
  return {
    pattern: /[0-9]/,
    message: '必须包含数字'
  }
}

const requireSpecialChar = function () {
  return {
    pattern: /[^0-9a-zA-Z]/,
    message: `必须包含特殊字符*&^%$#@!~,./等`
  }
}

const isImg = function (fileRaw) {
  return /(\.png|\.jpg)$/.test(fileRaw.name)
}

const isSizeFit = function (fileRaw, mb) {
  return fileRaw.size <= mb * 1014 * 1024
}

export {
  notEmpty,
  requireDigit,
  requireCharacter,
  requireSpecialChar,
  minLength,
  maxLength,
  emailValidator,
  checkPasswordValidator,
  supportCharOrDigiOrUnderline,
  isImg,
  isSizeFit,
}
