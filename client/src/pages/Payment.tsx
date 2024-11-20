import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import React, { useEffect, useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Label } from '@radix-ui/react-label';
import axios from 'axios';
import moment from 'moment';

interface TenantsDataTypes {
  name: string;
  date_birth: string;
  gender: string;
  address: string;
  nationality: string;
  phone: string;
  email?: string;
  business_name: string;
  business_type: string;
  lease_duration: string;
}

interface StallsTypes extends TenantsDataTypes {
  signed_lease_path: string;
  id_proof_path: string;
  payment_status: string;
  stall_no: string;
  created_at: string;
  tenants_id: number;
  current_balance: number;
}

const Payment = () => {
  const [stalls, setStalls] = useState<StallsTypes[]>([]);
  const [selectedLeaseDurationRenew, setSelectedLeaseDurationRenew] =
    useState<string>('');

  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [currentAmountBalance, setCurrentAmountBalance] = useState<number>(0);
  const [tenantID, setTenantID] = useState<number>(0);

  const [open, setOpen] = useState(false);
  const fetchStalls = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_LINK}/api/tenants/payments`,
      );

      console.log(res.data, 'stalls');
      setStalls(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchStalls();
  }, []);

  const handleAddPayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_LINK}/api/payments/create`,
        {
          current_balance: currentAmountBalance - totalPayment,
          amount_pay: totalPayment,
          tenants_id: tenantID,
        },
      );

      toast({
        title: 'Payment added successfully',
        description: 'You have successfully added a payment',
      });

      fetchStalls();

      console.log(res.data, 'stalls');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Owner Name</TableHead>
            <TableHead>Start</TableHead>
            <TableHead>Expiration</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Current Balance</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(stalls) && stalls.length > 0 ? (
            stalls.map((stall, index) => (
              <TableRow key={index}>
                <TableCell>{stall.name}</TableCell>
                <TableCell>{moment(stall.created_at).format('LL')}</TableCell>
                <TableCell>
                  <h1>
                    {(() => {
                      const createdDate = new Date(stall.created_at);

                      switch (stall.lease_duration) {
                        case '1 month':
                          createdDate.setMonth(createdDate.getMonth() + 1);
                          break;
                        case '3 months':
                          createdDate.setMonth(createdDate.getMonth() + 3);
                          break;
                        case '6 months':
                          createdDate.setMonth(createdDate.getMonth() + 6);
                          break;
                        case '1 year':
                        default:
                          createdDate.setFullYear(
                            createdDate.getFullYear() + 1,
                          );
                          break;
                      }

                      return createdDate.toLocaleDateString();
                    })()}
                  </h1>
                </TableCell>

                <TableCell>{stall.lease_duration}</TableCell>

                <TableCell>
                  {stall.lease_duration.length > 0
                    ? stall.lease_duration === '3 month'
                      ? 8000 * 3
                      : stall.lease_duration === '6 months'
                      ? 8000 * 6
                      : stall.lease_duration === '9 months'
                      ? 8000 * 9
                      : 8000 * 12
                    : 0}
                </TableCell>

                <TableCell>
                  {stall.current_balance === null ? (
                    <span>
                      {stall.lease_duration === '3 month'
                        ? 8000 * 3
                        : stall.lease_duration === '6 months'
                        ? 8000 * 6
                        : stall.lease_duration === '9 months'
                        ? 8000 * 9
                        : 8000 * 12}
                    </span>
                  ) : (
                    <span>{stall.current_balance}</span>
                  )}
                </TableCell>

                <TableCell>
                  <div>
                    <Dialog>
                      <DialogTrigger>
                        {' '}
                        <Button variant={'secondary'}>Renew</Button>
                      </DialogTrigger>
                      <DialogContent className="w-[40%]">
                        <DialogHeader>
                          <DialogTitle>
                            Renew payment for business {stall.business_name}
                          </DialogTitle>
                          <DialogDescription>
                            Owner Name: {stall.name}
                          </DialogDescription>
                        </DialogHeader>

                        <div className="w-full">
                          <Label>Lease Duration</Label>
                          <Select
                            onValueChange={(value) =>
                              setSelectedLeaseDurationRenew(value)
                            }
                          >
                            <SelectTrigger className="w-full h-[3rem]">
                              <SelectValue placeholder="Select lease duration" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="3 months">3 months</SelectItem>
                              <SelectItem value="6 months">6 months</SelectItem>
                              <SelectItem value="9 months">9 months</SelectItem>
                              <SelectItem value="1 year">1 year</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="w-full">
                          <Label>Total Payment</Label>
                          <Input
                            className="h-[3rem] "
                            type="number"
                            name="total_payment"
                            readOnly
                            // onChange={(e) => setTotalPayment(+e.target.value)}
                            value={
                              selectedLeaseDurationRenew.length > 0
                                ? selectedLeaseDurationRenew === '3 months'
                                  ? 8000 * 3
                                  : selectedLeaseDurationRenew === '6 months'
                                  ? 8000 * 6
                                  : selectedLeaseDurationRenew === '9 months'
                                  ? 8000 * 9
                                  : 8000 * 12
                                : 0
                            }
                          />

                          <Button className="my-4">Submit</Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button variant={'secondary'}>Remove</Button>

                    <Dialog
                      // open={true}
                      onOpenChange={(isOpen) => {
                        setOpen(isOpen);
                        if (!isOpen) {
                          setTotalPayment(0);
                        }
                      }}
                    >
                      <DialogTrigger>
                        <Button
                          onClick={() => {
                            // setOpen(true);
                            setCurrentAmountBalance(
                              stall.lease_duration.length > 0
                                ? stall.lease_duration === '3 month'
                                  ? 8000 * 3
                                  : stall.lease_duration === '6 months'
                                  ? 8000 * 6
                                  : stall.lease_duration === '9 months'
                                  ? 8000 * 9
                                  : 8000 * 12
                                : 0,
                            );

                            setTenantID(stall.tenants_id);
                          }}
                          variant={'secondary'}
                        >
                          Pay
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="w-[40%]">
                        <DialogHeader>
                          <DialogTitle>
                            Pay for business {stall.business_name}
                          </DialogTitle>
                          <DialogDescription>
                            Owner Name: {stall.name}
                          </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleAddPayment}>
                          <div className="w-full">
                            <Label>Current Balance</Label>
                            <span className="block">
                              {stall.current_balance === null ? (
                                <span className="font-bold text-xl">
                                  {stall.lease_duration === '3 month'
                                    ? 8000 * 3
                                    : stall.lease_duration === '6 months'
                                    ? 8000 * 6
                                    : stall.lease_duration === '9 months'
                                    ? 8000 * 9
                                    : 8000 * 12}
                                </span>
                              ) : (
                                <span className="font-bold text-xl">
                                  {stall.current_balance}
                                </span>
                              )}
                            </span>

                            <Label>Enter Amount</Label>
                            <Input
                              className="h-[3rem] "
                              type="number"
                              name="enter_payment"
                              onChange={(e) => setTotalPayment(+e.target.value)}
                            />
                            <Button
                              disabled={
                                stall.current_balance - totalPayment < 0 ||
                                totalPayment === 0
                              }
                              onClick={() => setOpen(false)}
                              type="submit"
                              className="my-4"
                            >
                              Submit
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>

                    <Button variant={'secondary'}>Mark Overdue</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5}>No data available</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Payment;
