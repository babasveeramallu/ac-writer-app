export const templates = [
  {
    name: "Login/Authentication",
    key: "login-auth",
    description: "Use for user authentication, login, logout, and password management features",
    content: `## Acceptance Criteria

### Scenario 1: Successful Login with Valid Credentials
**Given** the user is on the login page
**And** they have a registered account
**When** they enter valid username and password
**And** click "Login"
**Then** they should be redirected to the dashboard
**And** see a welcome message with their name

### Scenario 2: Failed Login with Invalid Password
**Given** the user is on the login page
**When** they enter a valid username
**And** enter an incorrect password
**And** click "Login"
**Then** they should see error message "Invalid username or password"
**And** remain on the login page
**And** the password field should be cleared

### Scenario 3: Account Locked After Multiple Failures
**Given** the user has failed login 5 times
**When** they attempt to login again
**Then** they should see error "Account locked due to multiple failed attempts"
**And** receive an email with unlock instructions
**And** account should unlock after 30 minutes

### Scenario 4: Forgot Password Flow
**Given** the user is on the login page
**When** they click "Forgot Password"
**And** enter their registered email address
**And** click "Send Reset Link"
**Then** they should receive a password reset email
**And** the reset link should be valid for 24 hours
**And** see confirmation message "Reset link sent to your email"

### Scenario 5: Remember Me Functionality
**Given** the user is on the login page
**When** they check "Remember Me" checkbox
**And** login with valid credentials
**Then** their session should persist for 30 days
**And** they should not need to login again on the same device`
  },
  
  {
    name: "CRUD Operations",
    key: "crud-operations",
    description: "Use for Create, Read, Update, Delete functionality on any entity",
    content: `## Acceptance Criteria

### Scenario 1: Successful Creation with Valid Data
**Given** the user has create permissions
**And** they are on the create form
**When** they fill in all required fields with valid data
**And** click "Save"
**Then** the record should be created in the database
**And** they should see success message "Record created successfully"
**And** be redirected to the record detail page

### Scenario 2: Validation Errors on Missing Required Fields
**Given** the user is on the create form
**When** they leave required fields empty
**And** click "Save"
**Then** they should see validation errors for each missing field
**And** the form should not submit
**And** focus should move to the first error field

### Scenario 3: Reading Existing Record
**Given** a record exists in the system
**When** the user navigates to the record detail page
**Then** all record fields should be displayed correctly
**And** timestamps should show creation and last modified dates
**And** user should see edit and delete buttons if they have permissions

### Scenario 4: Updating with Valid Changes
**Given** the user has edit permissions
**And** they are viewing an existing record
**When** they click "Edit"
**And** modify field values
**And** click "Update"
**Then** changes should be saved to the database
**And** they should see success message "Record updated successfully"
**And** last modified timestamp should be updated

### Scenario 5: Deleting with Confirmation
**Given** the user has delete permissions
**And** they are viewing a record
**When** they click "Delete"
**And** confirm the deletion in the popup
**Then** the record should be removed from the database
**And** they should see success message "Record deleted successfully"
**And** be redirected to the list page

### Scenario 6: Concurrent Modification Handling
**Given** two users are editing the same record
**When** User A saves changes
**And** User B tries to save changes
**Then** User B should see warning "Record was modified by another user"
**And** be prompted to refresh and review changes`
  },
  
  {
    name: "Payment Processing",
    key: "payment-processing",
    description: "Use for payment, checkout, billing, and transaction features",
    content: `## Acceptance Criteria

### Scenario 1: Successful Payment with Valid Card
**Given** the user has items in their cart
**And** they are on the payment page
**When** they enter valid credit card details
**And** click "Pay Now"
**Then** payment should be processed successfully
**And** they should see confirmation message "Payment successful"
**And** receive a confirmation email with receipt
**And** order status should change to "Paid"

### Scenario 2: Declined Card
**Given** the user is on the payment page
**When** they enter card details that will be declined
**And** click "Pay Now"
**Then** they should see error "Payment declined by your bank"
**And** no charge should be made
**And** order status should remain "Pending Payment"
**And** they should be able to try a different payment method

### Scenario 3: Expired Card
**Given** the user enters an expired credit card
**When** they click "Pay Now"
**Then** they should see error "Card has expired"
**And** be prompted to enter a valid card
**And** no payment attempt should be made

### Scenario 4: Insufficient Funds
**Given** the user's card has insufficient funds
**When** they attempt payment
**Then** they should see error "Insufficient funds"
**And** no charge should be made
**And** they should be offered alternative payment methods

### Scenario 5: Payment Timeout
**Given** the user is processing payment
**When** the payment gateway takes longer than 30 seconds
**Then** they should see message "Payment processing is taking longer than expected"
**And** be given option to wait or cancel
**And** if timeout occurs, no duplicate charges should be made

### Scenario 6: Receipt Generation
**Given** payment was successful
**Then** a receipt should be generated with transaction ID
**And** include itemized list of purchases
**And** show payment method used (last 4 digits)
**And** include date, time, and total amount
**And** be available for download as PDF`
  },
  
  {
    name: "Search & Filter",
    key: "search-filter",
    description: "Use for search functionality, filtering, sorting, and result display",
    content: `## Acceptance Criteria

### Scenario 1: Search with Results Found
**Given** the user is on the search page
**When** they enter a search term that matches existing records
**And** click "Search"
**Then** matching results should be displayed
**And** show result count "X results found"
**And** highlight the search term in results
**And** results should be paginated if more than 20

### Scenario 2: Search with No Results
**Given** the user enters a search term with no matches
**When** they click "Search"
**Then** they should see message "No results found for '[search term]'"
**And** see suggestions "Try different keywords or check spelling"
**And** be able to clear search and start over

### Scenario 3: Filter by Single Criterion
**Given** the user is viewing search results
**When** they select a filter option (e.g., Category = "Electronics")
**And** click "Apply Filter"
**Then** results should update to show only matching items
**And** filter tag should appear showing active filter
**And** result count should update

### Scenario 4: Filter by Multiple Criteria
**Given** the user has applied one filter
**When** they add additional filters (e.g., Price range, Brand)
**And** click "Apply"
**Then** results should match ALL selected criteria
**And** all active filters should be displayed as tags
**And** each filter tag should have a remove option

### Scenario 5: Clear Filters
**Given** the user has active filters applied
**When** they click "Clear All Filters"
**Then** all filters should be removed
**And** full result set should be displayed
**And** filter tags should disappear

### Scenario 6: Sort Results
**Given** the user is viewing search results
**When** they select sort option (e.g., "Price: Low to High")
**Then** results should reorder accordingly
**And** sort selection should remain visible
**And** pagination should reset to page 1`
  },
  
  {
    name: "Form Validation",
    key: "form-validation",
    description: "Use for any form with input validation requirements",
    content: `## Acceptance Criteria

### Scenario 1: Submit with All Valid Fields
**Given** the user is on the form
**When** they fill in all required fields with valid data
**And** click "Submit"
**Then** form should be submitted successfully
**And** they should see success message "Form submitted successfully"
**And** form fields should be cleared or user redirected

### Scenario 2: Submit with Missing Required Fields
**Given** the user is on the form
**When** they leave required fields empty
**And** click "Submit"
**Then** they should see error "Please fill in all required fields"
**And** each empty required field should show red border
**And** error message should appear below each field
**And** form should not submit

### Scenario 3: Invalid Email Format
**Given** the user is filling the email field
**When** they enter text without @ symbol or invalid format
**And** move to next field
**Then** they should see error "Please enter a valid email address"
**And** email field should show red border
**And** form should not submit until corrected

### Scenario 4: Password Strength Requirements
**Given** the user is creating a password
**When** they enter a password
**Then** they should see real-time feedback on strength
**And** password must be at least 8 characters
**And** must contain at least one uppercase letter
**And** must contain at least one number
**And** must contain at least one special character
**And** show error if requirements not met

### Scenario 5: Character Limits (Min/Max)
**Given** a field has character limits
**When** the user enters text
**Then** they should see character counter "X/100 characters"
**And** be prevented from entering more than maximum
**And** show error if less than minimum on submit
**And** counter should update in real-time

### Scenario 6: Special Character Validation
**Given** a field does not allow special characters
**When** the user enters special characters (!@#$%)
**Then** they should see error "Only letters and numbers allowed"
**And** invalid characters should be highlighted
**And** form should not submit until corrected`
  }
];

export default templates;
