# Sale API Integration Guide

## Endpoint: Create Sale

**POST** `/api/sales`

### Authentication

Requires JWT token in Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Request Body

```json
{
  "date": "2024-01-15",
  "buyer": {
    "id": "buyer-person-id",
    "name": "Buyer Name"
  },
  "witness": {
    "id": "witness-person-id",
    "name": "Witness Name"
  },
  "car": {
    "id": "purchase-id",
    "serialNo": "12345",
    "company": "Toyota",
    "model": "Corolla",
    "registration": "ABC-123"
  },
  "extraKeys": false,
  "documents": false,
  "numberPlates": false,
  "amount": 500000,
  "note": "Optional note here",
  "attachedDocuments": []
}
```

### Field Descriptions

**Required Fields:**

- `date`: String in ISO date format (YYYY-MM-DD)
- `buyer.id`: MongoDB ObjectId of the buyer person
- `buyer.name`: String, buyer's name
- `witness.id`: MongoDB ObjectId of the witness person
- `witness.name`: String, witness's name
- `car.id`: MongoDB ObjectId of the purchase/car
- `car.serialNo`: String, car serial number
- `car.company`: String, car company name
- `car.model`: String, car model name
- `car.registration`: String, car registration number
- `amount`: Number, sale amount (must be >= 0)

**Optional Fields:**

- `extraKeys`: Boolean, default false
- `documents`: Boolean, default false
- `numberPlates`: Boolean, default false
- `note`: String, optional note
- `attachedDocuments`: Array of strings (file paths/URLs), default empty array

### Success Response (201 Created)

```json
{
  "success": true,
  "message": "Sale created successfully",
  "data": {
    "_id": "sale-id",
    "userId": "user-id",
    "date": "2024-01-15T00:00:00.000Z",
    "buyer": {
      "id": {
        "_id": "buyer-person-id",
        "name": "Buyer Name",
        "phone1": "1234567890",
        "address": "Address"
      },
      "name": "Buyer Name"
    },
    "witness": {
      "id": {
        "_id": "witness-person-id",
        "name": "Witness Name",
        "phone1": "0987654321",
        "address": "Address"
      },
      "name": "Witness Name"
    },
    "car": {
      "id": {
        "_id": "purchase-id",
        "serialNo": "12345",
        "company": "Toyota",
        "carModel": "Corolla",
        "registration": "ABC-123"
      },
      "serialNo": "12345",
      "company": "Toyota",
      "model": "Corolla",
      "registration": "ABC-123"
    },
    "extraKeys": false,
    "documents": false,
    "numberPlates": false,
    "amount": 500000,
    "note": "Optional note here",
    "attachedDocuments": [],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Error Responses

**400 Bad Request - Validation Error:**

```json
{
  "success": false,
  "message": "Validation failed",
  "data": {
    "errors": [
      {
        "field": "date",
        "message": "Date is required",
        "code": "too_small"
      }
    ],
    "message": "Please check your input and try again"
  }
}
```

**401 Unauthorized:**

```json
{
  "success": false,
  "message": "Unauthorized",
  "data": "No token provided"
}
```

**500 Internal Server Error:**

```json
{
  "success": false,
  "message": "Internal server error",
  "data": "Error message here"
}
```

## Frontend Integration Example

### Using Fetch API

```javascript
const createSale = async (saleData) => {
  const token = localStorage.getItem("token"); // or wherever you store the token

  const response = await fetch("http://localhost:3000/api/sales", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(saleData),
  });

  const result = await response.json();

  if (result.success) {
    console.log("Sale created:", result.data);
    return result.data;
  } else {
    throw new Error(result.message || "Failed to create sale");
  }
};

// Usage
const saleData = {
  date: "2024-01-15",
  buyer: {
    id: selectedBuyer._id,
    name: selectedBuyer.name,
  },
  witness: {
    id: selectedWitness._id,
    name: selectedWitness.name,
  },
  car: {
    id: selectedCar._id,
    serialNo: selectedCar.serialNo,
    company: selectedCar.company,
    model: selectedCar.carModel,
    registration: selectedCar.registration,
  },
  extraKeys: extraKeys,
  documents: documents,
  numberPlates: numberPlates,
  amount: parseFloat(amount),
  note: note || undefined,
  attachedDocuments: [], // Add file paths/URLs here after upload
};

try {
  const createdSale = await createSale(saleData);
  console.log("Sale created successfully:", createdSale);
} catch (error) {
  console.error("Error creating sale:", error);
}
```

### Using Axios

```javascript
import axios from "axios";

const createSale = async (saleData) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.post(
      "http://localhost:3000/api/sales",
      saleData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data;
  } catch (error) {
    if (error.response) {
      // Server responded with error
      throw new Error(error.response.data.message || "Failed to create sale");
    } else {
      // Network error
      throw new Error("Network error. Please try again.");
    }
  }
};
```

### Using React Query / TanStack Query

```javascript
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const useCreateSale = () => {
  return useMutation({
    mutationFn: async (saleData) => {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/api/sales",
        saleData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    },
    onSuccess: (data) => {
      console.log("Sale created:", data);
      // Optionally invalidate sales list query
      // queryClient.invalidateQueries(['sales']);
    },
    onError: (error) => {
      console.error("Error creating sale:", error);
    },
  });
};

// Usage in component
const SaleForm = () => {
  const createSaleMutation = useCreateSale();

  const handleSaleCar = async () => {
    const saleData = {
      date: date,
      buyer: {
        id: selectedBuyer._id,
        name: selectedBuyer.name,
      },
      witness: {
        id: selectedWitness._id,
        name: selectedWitness.name,
      },
      car: {
        id: selectedCar._id,
        serialNo: selectedCar.serialNo,
        company: selectedCar.company,
        model: selectedCar.carModel,
        registration: selectedCar.registration,
      },
      extraKeys,
      documents,
      numberPlates,
      amount: parseFloat(amount),
      note: note || undefined,
      attachedDocuments: [],
    };

    try {
      await createSaleMutation.mutateAsync(saleData);
      // Reset form or show success message
    } catch (error) {
      // Handle error
    }
  };

  return (
    <button onClick={handleSaleCar} disabled={createSaleMutation.isPending}>
      {createSaleMutation.isPending ? "Creating..." : "Sale Car"}
    </button>
  );
};
```

## Notes

1. The `userId` is automatically extracted from the JWT token, so you don't need to send it in the request body.

2. Date format: Use ISO date string format (YYYY-MM-DD). The backend will convert it to a Date object.

3. File uploads: If you need to upload files, you'll need to:

   - Upload files first to get file paths/URLs
   - Then include those paths/URLs in the `attachedDocuments` array

4. All IDs (buyer.id, witness.id, car.id) must be valid MongoDB ObjectIds that exist in your database.

5. The response includes populated references for buyer, witness, and car, so you get full details back.
