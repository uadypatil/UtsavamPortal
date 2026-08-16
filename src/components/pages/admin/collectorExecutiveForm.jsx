import React from 'react';

export const INITIAL_FORM = {
    fullName: '',
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    contactNumber: '',
    alternateContactNumber: '',
    age: '',
    isActive: true,
};

export function validateCollector(form, isEdit = false) {
    const errors = {};

    const fullName = form.fullName?.trim() || '';
    const username = form.username?.trim() || '';
    const password = form.password || '';
    const confirmPassword = form.confirmPassword || '';
    const email = form.email?.trim() || '';
    const contactNumber = form.contactNumber?.trim() || '';
    const alternateContactNumber =
        form.alternateContactNumber?.trim() || '';

    // -----------------------------------------
    // Full Name
    // -----------------------------------------
    if (!fullName) {
        errors.fullName = 'Full name is required.';
    } else if (fullName.length < 3) {
        errors.fullName =
            'Full name must contain at least 3 characters.';
    } else if (fullName.length > 100) {
        errors.fullName =
            'Full name cannot exceed 100 characters.';
    }

    // -----------------------------------------
    // Username
    // -----------------------------------------
    if (!username) {
        errors.username = 'Username is required.';
    } else if (!/^[a-zA-Z0-9._-]{4,30}$/.test(username)) {
        errors.username =
            'Username must contain 4–30 letters, numbers, dots, underscores or hyphens.';
    }

    // -----------------------------------------
    // Password
    // -----------------------------------------
    if (!isEdit && !password) {
        errors.password = 'Password is required.';
    } else if (password && password.length < 6) {
        errors.password =
            'Password must contain at least 6 characters.';
    } else if (password && password.length > 100) {
        errors.password =
            'Password cannot exceed 100 characters.';
    }

    // -----------------------------------------
    // Confirm Password
    // -----------------------------------------
    if (password || !isEdit) {
        if (!confirmPassword) {
            errors.confirmPassword =
                'Please confirm the password.';
        } else if (password !== confirmPassword) {
            errors.confirmPassword =
                'Passwords do not match.';
        }
    }

    // -----------------------------------------
    // Email
    // -----------------------------------------
    if (email) {
        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            errors.email =
                'Please enter a valid email address.';
        }
    }

    // -----------------------------------------
    // Primary Contact
    // -----------------------------------------
    if (!contactNumber) {
        errors.contactNumber =
            'Primary contact number is required.';
    } else if (
        !/^[0-9+\-\s()]{10,15}$/.test(contactNumber)
    ) {
        errors.contactNumber =
            'Please enter a valid contact number.';
    }

    // -----------------------------------------
    // Alternate Contact
    // -----------------------------------------
    if (alternateContactNumber) {
        if (
            !/^[0-9+\-\s()]{10,15}$/.test(
                alternateContactNumber
            )
        ) {
            errors.alternateContactNumber =
                'Please enter a valid alternate contact number.';
        }

        if (
            alternateContactNumber === contactNumber
        ) {
            errors.alternateContactNumber =
                'Alternate contact must be different from primary contact.';
        }
    }

    // -----------------------------------------
    // Age
    // -----------------------------------------
    if (
        form.age !== '' &&
        form.age !== null &&
        form.age !== undefined
    ) {
        const age = Number(form.age);

        if (!Number.isInteger(age)) {
            errors.age = 'Age must be a valid number.';
        } else if (age < 18 || age > 100) {
            errors.age =
                'Age must be between 18 and 100.';
        }
    }

    return errors;
}

export function CollectorForm({
    form,
    errors,
    editing,
    saving,
    onChange,
    onSubmit,
    onCancel,
}) {
    return (
        <form onSubmit={onSubmit} noValidate>
            <div className="ep-chart-card">

                {/* =====================================================
                    PERSONAL INFORMATION
                ====================================================== */}
                <div className="ep-form-section">
                    <div className="ep-form-section__title">
                        <i className="bi bi-person" />
                        Personal Information
                    </div>

                    <div className="row g-3">

                        <Field
                            label="Full Name"
                            required
                            value={form.fullName}
                            error={errors.fullName}
                            placeholder="Enter collector full name"
                            onChange={(value) =>
                                onChange('fullName', value)
                            }
                            col="col-md-8"
                        />

                        <Field
                            label="Age"
                            type="number"
                            value={form.age}
                            error={errors.age}
                            placeholder="Enter age"
                            min="18"
                            max="100"
                            onChange={(value) =>
                                onChange('age', value)
                            }
                            col="col-md-4"
                        />

                    </div>
                </div>


                {/* =====================================================
                    ACCOUNT INFORMATION
                ====================================================== */}
                <div className="ep-form-section">

                    <div className="ep-form-section__title">
                        <i className="bi bi-shield-lock" />
                        Account Information
                    </div>

                    <div className="row g-3">

                        <Field
                            label="Username"
                            required
                            value={form.username}
                            error={errors.username}
                            placeholder="collector.username"
                            disabled={editing}
                            autoComplete="username"
                            onChange={(value) =>
                                onChange(
                                    'username',
                                    value.toLowerCase()
                                )
                            }
                            col="col-md-6"
                        />

                        <Field
                            label={
                                editing
                                    ? 'New Password'
                                    : 'Password'
                            }
                            required={!editing}
                            type="password"
                            value={form.password}
                            error={errors.password}
                            placeholder={
                                editing
                                    ? 'Leave blank to keep current password'
                                    : 'Enter password'
                            }
                            autoComplete={
                                editing
                                    ? 'new-password'
                                    : 'new-password'
                            }
                            onChange={(value) =>
                                onChange(
                                    'password',
                                    value
                                )
                            }
                            col="col-md-6"
                        />

                        {/* Confirm password */}
                        <Field
                            label="Confirm Password"
                            required={!editing || !!form.password}
                            type="password"
                            value={form.confirmPassword}
                            error={errors.confirmPassword}
                            placeholder="Re-enter password"
                            autoComplete="new-password"
                            onChange={(value) =>
                                onChange(
                                    'confirmPassword',
                                    value
                                )
                            }
                            col="col-md-6"
                        />

                    </div>

                    {editing && (
                        <div className="small text-muted mt-2">
                            <i className="bi bi-info-circle me-1" />
                            Leave the password fields blank if you
                            don't want to change the existing password.
                        </div>
                    )}
                </div>


                {/* =====================================================
                    CONTACT INFORMATION
                ====================================================== */}
                <div className="ep-form-section">

                    <div className="ep-form-section__title">
                        <i className="bi bi-telephone" />
                        Contact Information
                    </div>

                    <div className="row g-3">

                        <Field
                            label="Primary Contact"
                            required
                            type="tel"
                            value={form.contactNumber}
                            error={errors.contactNumber}
                            placeholder="Enter mobile number"
                            autoComplete="tel"
                            onChange={(value) =>
                                onChange(
                                    'contactNumber',
                                    value
                                )
                            }
                            col="col-md-6"
                        />

                        <Field
                            label="Alternate Contact"
                            type="tel"
                            value={
                                form.alternateContactNumber
                            }
                            error={
                                errors.alternateContactNumber
                            }
                            placeholder="Optional alternate number"
                            autoComplete="tel"
                            onChange={(value) =>
                                onChange(
                                    'alternateContactNumber',
                                    value
                                )
                            }
                            col="col-md-6"
                        />

                        <Field
                            label="Email Address"
                            type="email"
                            value={form.email}
                            error={errors.email}
                            placeholder="collector@example.com"
                            autoComplete="email"
                            onChange={(value) =>
                                onChange('email', value)
                            }
                            col="col-12"
                        />

                    </div>
                </div>


                {/* =====================================================
                    ACCOUNT STATUS
                ====================================================== */}
                <div className="ep-form-section">

                    <div className="ep-form-section__title">
                        <i className="bi bi-toggle-on" />
                        Account Status
                    </div>

                    <div className="ep-status-control">

                        <div>
                            <div className="fw-semibold">
                                Collector Access
                            </div>

                            <div className="small text-muted">
                                Disabled collectors cannot access
                                the collection account.
                            </div>
                        </div>

                        <div className="form-check form-switch">

                            <input
                                className="form-check-input ep-switch"
                                type="checkbox"
                                role="switch"
                                checked={
                                    form.isActive
                                }
                                onChange={(e) =>
                                    onChange(
                                        'isActive',
                                        e.target.checked
                                    )
                                }
                            />

                            <label className="form-check-label fw-semibold">
                                {form.isActive
                                    ? 'Active'
                                    : 'Disabled'}
                            </label>

                        </div>

                    </div>
                </div>


                {/* =====================================================
                    ASSIGNMENT INFORMATION
                ====================================================== */}
                <div className="ep-assignment-note mb-4">

                    <div className="ep-assignment-note__icon">
                        <i className="bi bi-diagram-3" />
                    </div>

                    <div>
                        <div className="fw-semibold">
                            Event Assignment
                        </div>

                        <div className="small text-muted">
                            This collector will be associated
                            with the current Season, Event and
                            Event Organizer context.
                        </div>
                    </div>

                </div>


                {/* =====================================================
                    ACTIONS
                ====================================================== */}
                <div className="d-flex justify-content-end gap-2">

                    <button
                        type="button"
                        className="btn ep-modal-secondary"
                        onClick={onCancel}
                        disabled={saving}
                    >
                        <i className="bi bi-x-lg me-2" />
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="btn ep-action-btn ep-action-btn--indigo"
                        disabled={saving}
                    >
                        {saving ? (
                            <>
                                <span
                                    className="spinner-border spinner-border-sm me-2"
                                    role="status"
                                    aria-hidden="true"
                                />

                                {editing
                                    ? 'Updating...'
                                    : 'Creating...'}
                            </>
                        ) : (
                            <>
                                <i className="bi bi-check2-circle me-2" />

                                {editing
                                    ? 'Update Collector'
                                    : 'Create Collector'}
                            </>
                        )}
                    </button>

                </div>

            </div>
        </form>
    );
}


/* =========================================================
   REUSABLE FIELD
========================================================= */

function Field({
    label,
    required = false,
    type = 'text',
    value = '',
    error,
    placeholder,
    disabled = false,
    min,
    max,
    autoComplete,
    onChange,
    col = 'col-12',
}) {
    return (
        <div className={col}>

            <label className="form-label fw-semibold">
                {label}

                {required && (
                    <span className="text-danger ms-1">
                        *
                    </span>
                )}
            </label>

            <input
                type={type}
                className={`form-control ${
                    error ? 'is-invalid' : ''
                }`}
                value={value}
                placeholder={placeholder}
                disabled={disabled}
                min={min}
                max={max}
                autoComplete={autoComplete}
                onChange={(e) =>
                    onChange(e.target.value)
                }
            />

            {error && (
                <div className="invalid-feedback">
                    {error}
                </div>
            )}

        </div>
    );
}