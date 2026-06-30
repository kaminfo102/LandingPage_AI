export interface Product {
    id: number;
    name: string;
    price: string;
    [key: string]: any;
}

export interface Category {
    id: number;
    name: string;
    [key: string]: any;
}

export interface Order {
    id: number;
    status: string;
    [key: string]: any;
}

export interface CreateOrderPayload {
    payment_method?: string;
    payment_method_title?: string;
    set_paid?: boolean;
    billing: {
        first_name: string;
        last_name?: string;
        address_1?: string;
        city: string;
        state: string;
        postcode?: string;
        country?: string;
        email?: string;
        phone: string;
    };
    shipping?: {
        first_name: string;
        last_name?: string;
        address_1?: string;
        city: string;
        state: string;
        postcode?: string;
        country?: string;
    };
    line_items: Array<{
        product_id: number;
        quantity: number;
    }>;
    shipping_lines?: Array<{
        method_id: string;
        method_title: string;
        total: string;
    }>;
    customer_note?: string;
}

export interface Post {
    id: number;
    title: { rendered: string };
    [key: string]: any;
}
