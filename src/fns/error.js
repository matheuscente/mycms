function error(code, name, message) {
    const msg = message ?? "An error as ocurred"
    const error = new Error(msg)
    error.code = code ??  error.code
    error.name = name ?? error.name
    return error
}

module.exports = error