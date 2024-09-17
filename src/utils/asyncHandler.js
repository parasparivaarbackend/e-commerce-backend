

const asyncHandler = (Handler) => {
    return (req,res,next) => Promise.resolve(Handler(req,res,next)).catch((err)=>next(err))
}

export {asyncHandler}