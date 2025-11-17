"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Eye, EyeOff } from "lucide-react";
import Label from "@/components/form/Label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import Swal from "sweetalert2";
import { createClient, getAccountTypes } from "@/app/actions/frontoffice";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from '@stripe/stripe-js';
import { createPaymentIntent } from "@/app/actions/createPaymentIntent";

// Load Stripe with the public key
const stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY ?? "pk_test_XXXX");

const PaymentForm = ({ onPaymentSuccess, clientSecret }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements || !clientSecret) return;

        setIsProcessing(true);
        try {
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                },
            });

            if (error) throw error;
            if (paymentIntent.status === "succeeded") {
                onPaymentSuccess();
            }
        } catch (error) {
            Swal.fire("Error", error.message, "error");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="border p-2 mb-2">
                <CardElement
                    options={{
                        style: {
                            base: { fontSize: '16px', color: '#32325d', '::placeholder': { color: '#aab7c4' } },
                            invalid: { color: '#fa755a' },
                        },
                    }}
                />
            </div>
            <Button type="submit" disabled={isProcessing || !stripe || !elements}>
                {isProcessing ? "Processing..." : "Pay now"}
            </Button>
        </form>
    );
};

export default function Inscription() {
    const [currentStep, setCurrentStep] = useState<string>("info");
    const [formData, setFormData] = useState({
        nom: "",
        email: "",
        motDePasse: "",
        confirmMotDePasse: "",
        typeCompte: "",
        legal_info: null as File | null,
        accepteConditions: false,
    });

    const [errors, setErrors] = useState({
        nom: "",
        email: "",
        motDePasse: "",
        confirmMotDePasse: "",
        typeCompte: "",
        legal_info: "",
        accepteConditions: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [plans, setPlans] = useState<Array<any>>([]);
    const [clientSecret, setClientSecret] = useState<string | null>("null");

    useEffect(() => {
        async function fetchPlans() {
            const data = await getAccountTypes();
            setPlans(
                data.map((p: any) => ({
                    value: p.id.toString(),
                    label: p.name,
                    price: p.price,
                    description: p.features?.join(", ") || "",
                }))
            );
        }
        fetchPlans();
    }, []);

    const selectedPlan = plans.find(plan => plan.value === formData.typeCompte);
    const isPaidPlan = selectedPlan && selectedPlan.price > 0;

    useEffect(() => {
        const fetchClientSecret = async () => {
            if (isPaidPlan) {
                const secret = await createPaymentIntent(19.99, "usd", "premium");
                setClientSecret(secret);
            } else {
                setClientSecret(null);
            }
        };
        fetchClientSecret();
    }, [formData.typeCompte, selectedPlan]);

    const validateStep1 = () => {
        let valid = true;
        const newErrors = { ...errors };

        if (!formData.nom.trim()) { newErrors.nom = "Name is required"; valid = false; } else newErrors.nom = "";
        if (!formData.email.trim()) { newErrors.email = "Email is required"; valid = false; }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { newErrors.email = "Invalid email format"; valid = false; }
        else newErrors.email = "";

        if (!formData.motDePasse) { newErrors.motDePasse = "Password is required"; valid = false; }
        else if (formData.motDePasse.length < 8) { newErrors.motDePasse = "Password must be at least 8 characters"; valid = false; }
        else newErrors.motDePasse = "";

        if (formData.motDePasse !== formData.confirmMotDePasse) { newErrors.confirmMotDePasse = "Passwords do not match"; valid = false; }
        else newErrors.confirmMotDePasse = "";

        if (!formData.legal_info) { newErrors.legal_info = "Please upload a legal document"; valid = false; } else newErrors.legal_info = "";

        if (!formData.accepteConditions) { newErrors.accepteConditions = "You must accept the terms"; valid = false; } else newErrors.accepteConditions = "";

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async () => {
        if (!formData.typeCompte) { setErrors(e => ({ ...e, typeCompte: "Please select an account type" })); return; }
        if (isPaidPlan && !clientSecret) {
            Swal.fire("Error", "Please complete the payment", "error");
            return;
        }

        setIsLoading(true);
        try {
            const fd = new FormData();
            fd.append("company_name", formData.nom);
            fd.append("email", formData.email);
            fd.append("account_type", formData.typeCompte);
            fd.append("password", formData.motDePasse);
            if (formData.legal_info) fd.append("legal_info", formData.legal_info);

            const result = await createClient(fd);
            if (result.success) {
                Swal.fire("Success", result.message, "success");
                setFormData({
                    nom: "",
                    email: "",
                    motDePasse: "",
                    confirmMotDePasse: "",
                    typeCompte: "",
                    legal_info: null,
                    accepteConditions: false,
                });
                setErrors({
                    nom: "",
                    email: "",
                    motDePasse: "",
                    confirmMotDePasse: "",
                    typeCompte: "",
                    legal_info: "",
                    accepteConditions: "",
                });
                setCurrentStep("info");
            } else {
                Swal.fire("Error", result.message, "error");
            }
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "Unable to create the account. " + (error as Error).message, "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePaymentSuccess = async () => {
        const fd = new FormData();
        fd.append("company_name", formData.nom);
        fd.append("email", formData.email);
        fd.append("account_type", formData.typeCompte);
        fd.append("password", formData.motDePasse);
        if (formData.legal_info) fd.append("legal_info", formData.legal_info);

        const result = await createClient(fd);
        if (result.success) {
            Swal.fire("Success", result.message, "success");
            setFormData({
                nom: "",
                email: "",
                motDePasse: "",
                confirmMotDePasse: "",
                typeCompte: "",
                legal_info: null,
                accepteConditions: false,
            });
            setErrors({
                nom: "",
                email: "",
                motDePasse: "",
                confirmMotDePasse: "",
                typeCompte: "",
                legal_info: "",
                accepteConditions: "",
            });
            setCurrentStep("info");
        } else {
            Swal.fire("Error", result.message, "error");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/5">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center space-y-4 mb-8">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-wider">
                        <span className="text-brand-500">Create your account</span>
                        <br />
                        <span className="text-muted-foreground">Quality Assurance</span>
                    </h1>
                    <p className="text-lg text-muted-foreground">Join the teams who already trust Quality Assurance with their quality programs.</p>
                </div>

                <Tabs value={currentStep} onValueChange={setCurrentStep} className="space-y-6">
                    {/* Step 1: Informations personnelles */}
                    <TabsContent value="info">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <User className="h-5 w-5" />
                                    <span>Personal information</span>
                                </CardTitle>
                                <CardDescription>Tell us a bit about you to create your account</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); if (validateStep1()) setCurrentStep("plan"); }}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <Label htmlFor="nom">Company or personal name *</Label>
                                            <Input id="nom" value={formData.nom} onChange={e => setFormData({ ...formData, nom: e.target.value })} placeholder="Quality Assurance" className="pr-10 bg-gray-50" />
                                            {errors.nom && <p className="text-xs text-red-500">{errors.nom}</p>}
                                        </div>
                                        <div className="space-y-1">
                                            <Label htmlFor="email">Email *</Label>
                                            <Input id="email" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="you@company.com" className="pr-10 bg-gray-50" />
                                            {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <Label htmlFor="motDePasse">Password *</Label>
                                            <div className="relative">
                                                <Input id="motDePasse" type={showPassword ? "text" : "password"} value={formData.motDePasse} onChange={e => setFormData({ ...formData, motDePasse: e.target.value })} className="pr-10 bg-gray-50" placeholder="********" />
                                                <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3" onClick={() => setShowPassword(!showPassword)}>
                                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </Button>
                                            </div>
                                            {errors.motDePasse && <p className="text-xs text-red-500">{errors.motDePasse}</p>}
                                        </div>
                                        <div className="space-y-1">
                                            <Label htmlFor="confirmMotDePasse">Confirm password *</Label>
                                            <div className="relative">
                                                <Input id="confirmMotDePasse" type={showConfirmPassword ? "text" : "password"} value={formData.confirmMotDePasse} onChange={e => setFormData({ ...formData, confirmMotDePasse: e.target.value })} className="pr-10 bg-gray-50" placeholder="********" />
                                                <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </Button>
                                            </div>
                                            {errors.confirmMotDePasse && <p className="text-xs text-red-500">{errors.confirmMotDePasse}</p>}
                                        </div>
                                    </div>

                                    {/* Legal document */}
                                    <div className="space-y-1">
                                        <Label htmlFor="legal_info">Legal document *</Label>
                                        <Label
                                            htmlFor="legal_info"
                                            className="cursor-pointer h-24 w-full border-2 border-dashed flex flex-col justify-center items-center rounded-md bg-gray-50"
                                        >
                                            {formData.legal_info ? (
                                                <>
                                                    <span className="font-medium">{formData.legal_info.name}</span>
                                                    <span className="text-sm text-gray-500 mt-1">Click to change</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>.pdf, .jpg, .jpeg, .png</span>
                                                    <span className="text-sm text-gray-500 mt-1">Click to upload</span>
                                                </>
                                            )}
                                        </Label>
                                        <Input type="file" hidden id="legal_info" accept=".pdf,.jpg,.jpeg,.png" onChange={e => setFormData({ ...formData, legal_info: e.target.files?.[0] ?? null })} />
                                        {errors.legal_info && <p className="text-xs text-red-500">{errors.legal_info}</p>}
                                    </div>

                                    <div className="flex items-start space-x-2">
                                        <Checkbox checked={formData.accepteConditions} onCheckedChange={checked => setFormData({ ...formData, accepteConditions: !!checked })} id="conditions" />
                                        <Label htmlFor="conditions" className="text-sm leading-relaxed">
                                            I accept the <Link href="/conditions" className="text-primary hover:underline">terms of service</Link> and the <Link href="/confidentialite" className="text-primary hover:underline">privacy policy</Link> *
                                        </Label>
                                    </div>
                                    {errors.accepteConditions && <p className="text-xs text-red-500">{errors.accepteConditions}</p>}

                                    <div className="flex justify-end">
                                        <Button type="submit">Next</Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Step 2: Plan selection */}
                    <TabsContent value="plan">
                        <Card>
                            <CardHeader>
                                <CardTitle>Choose your plan</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Select value={formData.typeCompte} onValueChange={v => setFormData({ ...formData, typeCompte: v })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select your subscription" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {plans.map(plan => (
                                            <SelectItem key={plan.value} value={plan.value}>
                                                <div className="flex justify-between w-full items-center">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{plan.label}</span>
                                                        {plan.label === "Premium" && <Badge variant="default" className="mt-1">Popular</Badge>}
                                                        <div className="text-sm text-muted-foreground">{plan.description}</div>
                                                    </div>
                                                    <span className="font-bold">{plan.price === 0 ? "Free" : `${plan.price.toLocaleString()} Ar/year`}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {isPaidPlan && clientSecret && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Secure payment</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <Elements stripe={stripePromise} options={{ clientSecret }}>
                                                <PaymentForm onPaymentSuccess={handlePaymentSuccess} clientSecret={clientSecret} />
                                            </Elements>
                                        </CardContent>
                                    </Card>
                                )}

                                {selectedPlan && (
                                    <Card className="mt-4">
                                        <CardHeader>
                                            <CardTitle>Summary</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex justify-between">
                                                <span>Selected plan:</span>
                                                <Badge variant={selectedPlan.value === "premium" ? "default" : "secondary"}>{selectedPlan.label}</Badge>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Price:</span>
                                                <span className="font-bold">{selectedPlan.price === 0 ? "Free" : `${selectedPlan.price.toLocaleString()} Ar/year`}</span>
                                            </div>
                                            <div className="text-sm text-muted-foreground">{selectedPlan.description}</div>
                                        </CardContent>
                                    </Card>
                                )}

                                <div className="flex justify-between mt-4">
                                    <Button variant="outline" onClick={() => setCurrentStep("info")}>Back</Button>
                                    <Button onClick={handleSubmit} disabled={isLoading}>
                                        {isLoading ? "Creating account..." : "Create my account"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
