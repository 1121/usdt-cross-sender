import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Send, Zap, Shield, TrendingUp } from "lucide-react";

interface FormData {
  chain: string;
  rpcUrl: string;
  apiKey: string;
  privateKey: string;
  toAddress: string;
  amount: string;
}

const USDTSender = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    chain: "",
    rpcUrl: "",
    apiKey: "",
    privateKey: "",
    toAddress: "",
    amount: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (!formData.chain || !formData.toAddress || !formData.amount || !formData.privateKey) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (formData.chain === "EVM" && !formData.rpcUrl) {
      toast({
        title: "RPC URL required",
        description: "Please provide an EVM RPC URL",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (formData.chain === "TRON" && !formData.apiKey) {
      toast({
        title: "API Key required",
        description: "Please provide a TronGrid API key",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Simulate transaction (in real implementation, this would call the actual blockchain)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Transaction Sent! ✅",
        description: `Successfully sent ${formData.amount} USDT on ${formData.chain}`,
        variant: "default",
      });

      // Reset form
      setFormData({
        chain: "",
        rpcUrl: "",
        apiKey: "",
        privateKey: "",
        toAddress: "",
        amount: "",
      });
    } catch (error) {
      toast({
        title: "Transaction Failed",
        description: "Please check your inputs and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Send className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold gradient-primary bg-clip-text text-transparent">
              USDT Sender
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Send USDT tokens on TRON (TRC-20) and Ethereum (ERC-20) networks
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="text-center p-4">
            <Zap className="h-6 w-6 mx-auto mb-2 text-primary" />
            <h3 className="font-semibold">Fast Transfers</h3>
            <p className="text-sm text-muted-foreground">Lightning-fast blockchain transactions</p>
          </Card>
          <Card className="text-center p-4">
            <Shield className="h-6 w-6 mx-auto mb-2 text-primary" />
            <h3 className="font-semibold">Secure</h3>
            <p className="text-sm text-muted-foreground">Private keys handled securely</p>
          </Card>
          <Card className="text-center p-4">
            <TrendingUp className="h-6 w-6 mx-auto mb-2 text-primary" />
            <h3 className="font-semibold">Multi-Chain</h3>
            <p className="text-sm text-muted-foreground">Support for EVM and TRON</p>
          </Card>
        </div>

        {/* Main Form */}
        <Card className="shadow-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Send USDT</CardTitle>
            <CardDescription>
              Choose your network and fill in the transaction details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Network Selection */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="chain">Blockchain Network</Label>
                  <Select value={formData.chain} onValueChange={(value) => handleInputChange("chain", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select network" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EVM">Ethereum (EVM)</SelectItem>
                      <SelectItem value="TRON">TRON Network</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="toAddress">Recipient Address</Label>
                  <Input
                    id="toAddress"
                    placeholder="Enter recipient address"
                    value={formData.toAddress}
                    onChange={(e) => handleInputChange("toAddress", e.target.value)}
                  />
                </div>
              </div>

              {/* Conditional Network Fields */}
              <div className="grid md:grid-cols-2 gap-4">
                {formData.chain === "EVM" && (
                  <div className="space-y-2">
                    <Label htmlFor="rpcUrl">EVM RPC URL</Label>
                    <Input
                      id="rpcUrl"
                      placeholder="https://mainnet.infura.io/v3/..."
                      value={formData.rpcUrl}
                      onChange={(e) => handleInputChange("rpcUrl", e.target.value)}
                    />
                  </div>
                )}

                {formData.chain === "TRON" && (
                  <div className="space-y-2">
                    <Label htmlFor="apiKey">TronGrid API Key</Label>
                    <Input
                      id="apiKey"
                      placeholder="Enter TronGrid API key"
                      value={formData.apiKey}
                      onChange={(e) => handleInputChange("apiKey", e.target.value)}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="amount">USDT Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.000001"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => handleInputChange("amount", e.target.value)}
                  />
                </div>
              </div>

              {/* Private Key */}
              <div className="space-y-2">
                <Label htmlFor="privateKey">Private Key</Label>
                <Input
                  id="privateKey"
                  type="password"
                  placeholder="Enter your wallet private key"
                  value={formData.privateKey}
                  onChange={(e) => handleInputChange("privateKey", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  ⚠️ Your private key is processed locally and never stored
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="crypto"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Sending Transaction...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send USDT
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>⚡ Powered by Web3 • Secure • Fast • Reliable</p>
        </div>
      </div>
    </div>
  );
};

export default USDTSender;