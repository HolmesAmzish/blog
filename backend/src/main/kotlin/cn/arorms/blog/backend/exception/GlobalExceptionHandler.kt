package cn.arorms.blog.backend.exception

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException
import java.time.LocalDateTime

/**
 * Global exception handler for REST API
 */
@RestControllerAdvice
class GlobalExceptionHandler {
    
    /**
     * Handle IllegalArgumentException
     */
    @ExceptionHandler(IllegalArgumentException::class)
    fun handleIllegalArgumentException(ex: IllegalArgumentException): ResponseEntity<ErrorResponse> {
        val errorResponse = ErrorResponse(
            status = HttpStatus.BAD_REQUEST.value(),
            error = "Bad Request",
            message = ex.message ?: "Invalid argument",
            timestamp = LocalDateTime.now()
        )
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse)
    }
    
    /**
     * Handle NoSuchElementException
     */
    @ExceptionHandler(NoSuchElementException::class)
    fun handleNoSuchElementException(ex: NoSuchElementException): ResponseEntity<ErrorResponse> {
        val errorResponse = ErrorResponse(
            status = HttpStatus.NOT_FOUND.value(),
            error = "Not Found",
            message = ex.message ?: "Resource not found",
            timestamp = LocalDateTime.now()
        )
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse)
    }
    
    /**
     * Handle validation errors
     */
    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidationException(ex: MethodArgumentNotValidException): ResponseEntity<ErrorResponse> {
        val errors = ex.bindingResult.fieldErrors.map { fieldError ->
            "${fieldError.field}: ${fieldError.defaultMessage}"
        }
        val errorResponse = ErrorResponse(
            status = HttpStatus.BAD_REQUEST.value(),
            error = "Validation Failed",
            message = errors.joinToString(", "),
            timestamp = LocalDateTime.now()
        )
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse)
    }
    
    /**
     * Handle type mismatch errors
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException::class)
    fun handleTypeMismatchException(ex: MethodArgumentTypeMismatchException): ResponseEntity<ErrorResponse> {
        val errorResponse = ErrorResponse(
            status = HttpStatus.BAD_REQUEST.value(),
            error = "Type Mismatch",
            message = "Parameter '${ex.name}' should be of type ${ex.requiredType?.simpleName}",
            timestamp = LocalDateTime.now()
        )
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse)
    }
    
    /**
     * Handle all other exceptions
     */
    @ExceptionHandler(Exception::class)
    fun handleGenericException(ex: Exception): ResponseEntity<ErrorResponse> {
        val errorResponse = ErrorResponse(
            status = HttpStatus.INTERNAL_SERVER_ERROR.value(),
            error = "Internal Server Error",
            message = ex.message ?: "An unexpected error occurred",
            timestamp = LocalDateTime.now()
        )
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse)
    }
    
    /**
     * Standard error response DTO
     */
    data class ErrorResponse(
        val status: Int,
        val error: String,
        val message: String,
        val timestamp: LocalDateTime
    )
}