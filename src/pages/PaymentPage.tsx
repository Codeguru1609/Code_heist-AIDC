import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, CreditCard, Shield, CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { authService } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export default function PaymentPage() {
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    billingAddress: ""
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Mock payment processing
    setTimeout(async () => {
      try {
        setPaymentSuccess(true);
        toast({ 
          title: "Payment Successful!", 
          description: "Welcome to HeartClutch Premium." 
        });
      } catch (error) {
        toast({ 
          title: "Payment failed", 
          description: "Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsProcessing(false);
      }
    }, 2000);
  };

  const completePurchase = async () => {
    try {
      await authService.upgradeToPremium();
      toast({ 
        title: "Premium Activated!", 
        description: "All premium features are now available." 
      });
      navigate("/dashboard");
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to activate premium. Please contact support.",
        variant: "destructive"
      });
    }
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-soft flex items-center justify-center p-4">
        <Card className="health-card max-w-md w-full">
          <CardContent className="pt-8 text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-health-excellent/20 rounded-full flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-health-excellent" />
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Payment Successful!</h2>
              <p className="text-muted-foreground">
                Your premium subscription is ready. Welcome to advanced heart health monitoring.
              </p>
            </div>

            <div className="bg-accent/20 p-4 rounded-lg">
              <h3 className="font-semibold text-accent-foreground mb-2">What's Next?</h3>
              <ul className="text-sm text-accent-foreground/80 space-y-1">
                <li>• Access to Family Health Section</li>
                <li>• Unlimited SOS Contacts</li>
                <li>• Weekly AI Reports</li>
                <li>• 30-Day Health Trends</li>
              </ul>
            </div>

            <Button 
              onClick={completePurchase}
              className="w-full bg-primary hover:bg-primary/90 transition-bounce hover:scale-105"
            >
              Complete Setup
              <Heart className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-soft">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Heart className="h-6 w-6 text-primary-foreground heart-pulse" />
            </div>
            <span className="text-2xl font-bold text-primary">HeartClutch</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Complete Your Premium Upgrade</h1>
          <p className="text-muted-foreground">Secure payment powered by industry-standard encryption</p>
        </div>

        <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card className="health-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary" />
                <span>Order Summary</span>
              </CardTitle>
              <CardDescription>HeartClutch Premium - 3 Month Plan</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Premium Plan (3 months)</span>
                  <span>₹1,499</span>
                </div>
                <div className="flex justify-between text-sm text-health-good">
                  <span>Savings vs monthly billing</span>
                  <span>-₹500</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-primary">₹1,499</span>
                </div>
              </div>

              <div className="bg-primary-soft/30 p-4 rounded-lg space-y-2">
                <h4 className="font-semibold text-primary">Premium Benefits Include:</h4>
                <ul className="text-sm space-y-1 text-primary/80">
                  <li>✓ Unlimited AI Chatbot & SOS Contacts</li>
                  <li>✓ Family Health Sharing</li>
                  <li>✓ Weekly Detailed AI Reports</li>
                  <li>✓ 30-Day Health Trends</li>
                  <li>✓ Priority Customer Support</li>
                </ul>
              </div>

              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>256-bit SSL encryption • Cancel anytime</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card className="health-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <span>Payment Information</span>
              </CardTitle>
              <CardDescription>Enter your payment details to complete the purchase</CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handlePayment} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardholderName">Cardholder Name</Label>
                  <Input
                    id="cardholderName"
                    placeholder="John Doe"
                    value={paymentData.cardholderName}
                    onChange={(e) => handleInputChange("cardholderName", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={paymentData.cardNumber}
                    onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      value={paymentData.expiryDate}
                      onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={paymentData.cvv}
                      onChange={(e) => handleInputChange("cvv", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="billingAddress">Billing Address</Label>
                  <Input
                    id="billingAddress"
                    placeholder="123 Main St, City, Country"
                    value={paymentData.billingAddress}
                    onChange={(e) => handleInputChange("billingAddress", e.target.value)}
                    required
                  />
                </div>

                <div className="pt-4 space-y-3">
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-lg py-6"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        Pay ₹1,499
                        <CreditCard className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate("/plan")}
                    disabled={isProcessing}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Plan Selection
                  </Button>
                </div>
              </form>

              <div className="mt-6 text-center">
                <p className="text-xs text-muted-foreground">
                  By completing this purchase you agree to our Terms of Service and Privacy Policy. 
                  Your subscription will auto-renew unless cancelled.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}