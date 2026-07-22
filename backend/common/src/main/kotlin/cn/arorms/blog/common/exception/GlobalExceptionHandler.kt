package cn.arorms.blog.common.exception

import cn.arorms.framework.common.domain.ApiResponse
import cn.arorms.framework.common.exception.BaseExceptionHandler
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException

/**
 * Global exception handler for REST API
 */
@RestControllerAdvice
class GlobalExceptionHandler : BaseExceptionHandler() {



    /**
     * Handle validation errors
     */
    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidationException(ex: MethodArgumentNotValidException): ApiResponse<Void> {
        val errors = ex.bindingResult.fieldErrors.joinToString(", ") { fieldError ->
            "${fieldError.field}: ${fieldError.defaultMessage}"
        }
        return ApiResponse.badRequest("Validation Failed: $errors")
    }

    /**
     * Handle type mismatch errors
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException::class)
    fun handleTypeMismatchException(ex: MethodArgumentTypeMismatchException): ApiResponse<Void> {
        return ApiResponse.badRequest("Parameter '${ex.name}' should be of type ${ex.requiredType?.simpleName}")
    }
}