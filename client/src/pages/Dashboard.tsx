import DEFDEF from '@/components/DEFDEF';
import { Button } from '@/components/ui/button';
import { stallsGround, stallsSecond } from '@/data';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Minus, PanelRightClose, Plus } from 'lucide-react';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  TransformComponent,
  TransformWrapper,
  useControls,
} from 'react-zoom-pan-pinch';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { Textarea } from '@/components/ui/textarea';
import PathLines from '@/components/PathLines';
import axios from 'axios';
import { toast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import DEFDEFSEC from '@/components/DEFDEFSEC';
import PathLines2nd from '@/components/PathLines2nd';

type InputType =
  | React.ChangeEvent<HTMLInputElement>
  | React.ChangeEvent<HTMLTextAreaElement>;

const Controls = ({
  showSecondFloor,
  setShowSecondFloor,
}: {
  showSecondFloor: boolean;
  setShowSecondFloor: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { zoomIn, zoomOut } = useControls();
  return (
    <div className="absolute top-4 right-4 flex flex-col gap-2">
      <Button
        variant="secondary"
        size="icon"
        onClick={() => zoomIn()}
        className="bg-white/90 hover:bg-white shadow-md text-black"
      >
        <Plus className="h-4 w-4" color="black" />
        <span className="sr-only">Zoom in</span>
      </Button>
      <Button
        variant="secondary"
        size="icon"
        onClick={() => zoomOut()}
        className="bg-white/90 hover:bg-white shadow-md text-black"
      >
        <Minus className="h-4 w-4 " color="black" />
        <span className="sr-only">Zoom out</span>
      </Button>

      <Button
        variant="secondary"
        size="icon"
        onClick={() => setShowSecondFloor(!showSecondFloor)}
        className="bg-white/90 hover:bg-white shadow-md text-black"
      >
        <PanelRightClose className="h-4 w-4 " color="black" />
        <span className="sr-only">Proceed 2nd Floor</span>
      </Button>
    </div>
  );
};

interface TenantsDataTypes {
  name: string;
  birthday: string;
  gender: string;
  address: string;
  nationality: string;
  phone: string;
  email?: string;
  business_name: string;
  business_type: string;
  lease_duration: string;
}
const Dashboard = () => {
  const [selectedStalls, setSelectedStalls] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [tenantData, setTenantData] = useState({} as TenantsDataTypes);
  const [imageFileID, setImageFileID] = useState<File | null>(null);
  const [imageID, setImageID] = useState<string | null>(null);
  const [imageFileLease, setImageFileLease] = useState<File | null>(null);
  const [imageLease, setImageLease] = useState<string | null>(null);
  const [showSecondFloor, setShowSecondFloor] = useState(false);

  const handleInput = (e: InputType) => {
    setTenantData({
      ...tenantData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddTenant = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_LINK}/api/reservation/create`,
        {
          stall_no: selectedStalls,
          ...tenantData,
        },

        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (res.data.status === 'success') {
        console.log(res.data);
        setShowModal(false);

        toast({
          title: 'Reservation Successful',
          description: 'You have successfully reserved a plot',
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleChangeImageID = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;

    if (selectedFile) {
      if (selectedFile.type.startsWith('image/')) {
        setImageFileID(selectedFile);
        setImageID(URL.createObjectURL(selectedFile));
        // setErrorImage(null);
      } else {
        // setErrorImage('Please select a valid image file.');
        setImageFileID(null);
      }
    }
  };

  const handleChangeImageLease = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;

    if (selectedFile) {
      if (selectedFile.type.startsWith('image/')) {
        setImageFileLease(selectedFile);
        setImageLease(URL.createObjectURL(selectedFile));
        // setErrorImage(null);
      } else {
        // setErrorImage('Please select a valid image file.');
        setImageFileLease(null);
      }
    }
  };

  return (
    <div className="h-full flex items-center justify-center">
      <div className="relative w-[100%] h-[70%] grid place-content-center place-items-center  overflow-hidden bg-transparent">
        {showSecondFloor ? (
          <TransformWrapper initialScale={1} minScale={0.5} maxScale={4}>
            <TransformComponent
              wrapperClass="w-fit h-fit"
              contentClass="w-fit h-fit"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                width="1080"
                zoomAndPan="magnify"
                viewBox="0 0 810 809.999993"
                height="1080"
                preserveAspectRatio="xMidYMid meet"
                version="1.0"
              >
                <DEFDEFSEC />
                {stallsSecond.map((stall, index) => (
                  <path
                    key={index}
                    onClick={() => {
                      console.log(stall.id);
                      setSelectedStalls(stall.id);
                      setShowModal(true);
                    }}
                    fill="#00bf63"
                    d={stall.d}
                    fill-opacity="1"
                    fill-rule="nonzero"
                  />
                ))}

                <PathLines2nd />
              </svg>
            </TransformComponent>
            <Controls
              showSecondFloor={showSecondFloor}
              setShowSecondFloor={setShowSecondFloor}
            />
          </TransformWrapper>
        ) : (
          <TransformWrapper initialScale={1} minScale={0.5} maxScale={4}>
            <TransformComponent
              wrapperClass="w-fit h-fit"
              contentClass="w-fit h-fit"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                width="1080"
                zoomAndPan="magnify"
                viewBox="0 0 810 809.999993"
                height="1080"
                preserveAspectRatio="xMidYMid meet"
                version="1.0"
              >
                <DEFDEF />

                {stallsGround.map((stall, index) => (
                  <path
                    key={index}
                    onClick={() => {
                      setSelectedStalls(stall.id);
                      setShowModal(true);
                    }}
                    fill="#00bf63"
                    d={stall.d}
                    fill-opacity="1"
                    fill-rule="nonzero"
                  />
                ))}

                <PathLines />
              </svg>
              {/* 
              <svg
                className="rotate-[270deg]"
                width="297mm"
                height="210mm"
                viewBox="0 0 1122.5197 793.70081"
                version="1.1"
                id="svg1"
                xmlSpace="preserve"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs id="defs1" />
                <g id="layer1">
                  <SVGIMAGENEW />

                  {plots.map((plot, index) => (
                    <Plot
                      selectedPatay={selectedStalls}
                      key={index}
                      id={`PLOT_${index + 1}`}
                      d={plot.d}
                      onClick={() => handleAddPlot(`PLOT_${index + 1}`)}
                    />
                  ))}
                </g>
              </svg> */}
            </TransformComponent>
            <Controls
              showSecondFloor={showSecondFloor}
              setShowSecondFloor={setShowSecondFloor}
            />
          </TransformWrapper>
        )}
      </div>

      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">INV001</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Credit Card</TableCell>
            <TableCell className="text-right">$250.00</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div
            className="w-[40%] h-fit bg-white text-black rounded-2xl p-4 shadow-lg"
            // style={{ backgroundImage: `url(${BGImage})` }}
          >
            {/* Modal content */}
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl">New tenant form</h1>

                <Button onClick={() => setShowModal(false)}>Close</Button>
              </div>
              <div className="flex-1 text-start justify-center h-full items-start flex flex-col w-full">
                <h1 className="text-2xl my-2">
                  Stall No:{' '}
                  <span className='bg-green-800 text-white inline-block p-2 rounded-md rounded-md"'>
                    {selectedStalls}
                  </span>
                </h1>

                <form onSubmit={handleAddTenant} className="mt-2 w-full">
                  <div>
                    <Label>Name</Label>
                    <Input
                      className="h-[3rem] rounded-full "
                      type="text"
                      name="name"
                      onChange={handleInput}
                      value={tenantData.name}
                    />
                  </div>

                  <div className="flex gap-2">
                    <div className="w-full">
                      <Label htmlFor="date">Date of Birth</Label>
                      <Input
                        className="h-[3rem] rounded-full"
                        type="date"
                        id="date"
                        name="birthday"
                        value={tenantData.birthday}
                        onChange={handleInput}
                        required
                      />
                    </div>

                    <div className="w-full">
                      <Label htmlFor="date">Gender</Label>

                      <Select>
                        <SelectTrigger className="w-full h-[3rem]">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Label>Nationality</Label>
                  <Input
                    className="h-[3rem] rounded-full "
                    type="text"
                    name="nationality"
                    onChange={handleInput}
                    value={tenantData.nationality}
                  />

                  <div>
                    <Label>Contact Information</Label>
                    <div className="flex gap-4">
                      <Input
                        placeholder="Phone Number"
                        className="h-[3rem] rounded-full "
                        type="number"
                        name="phone"
                        onChange={handleInput}
                        value={tenantData.phone}
                      />

                      <Input
                        placeholder="Email"
                        className="h-[3rem] rounded-full "
                        type="email"
                        name="email"
                        onChange={handleInput}
                        value={tenantData.email}
                      />
                    </div>
                  </div>

                  <Separator className="my-8" />

                  <Label>Business Information</Label>

                  <div className="flex gap-2 w-full">
                    <div className="w-full">
                      <Label>Business Name</Label>
                      <Input
                        className="h-[3rem] rounded-full "
                        type="text"
                        name="business_name"
                        onChange={handleInput}
                        value={tenantData.business_name}
                      />
                    </div>

                    <div className="w-full">
                      <Label>Business Type</Label>
                      <Input
                        className="h-[3rem] rounded-full "
                        type="text"
                        name="business_type"
                        onChange={handleInput}
                        value={tenantData.business_type}
                      />
                    </div>
                  </div>

                  <Label>Rental Info</Label>

                  <Label>Lease Duration</Label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select lease duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1 month">1 month</SelectItem>
                      <SelectItem value="3 months">3 months</SelectItem>
                      <SelectItem value="6 months">6 months</SelectItem>
                      <SelectItem value="1 year">1 year</SelectItem>
                    </SelectContent>
                  </Select>

                  <Label>Additional Information</Label>

                  <div className="flex w-full gap-4">
                    <div className="w-full">
                      <Label>ID Proof</Label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleChangeImageID}
                        className="cursor-pointer"
                        required
                      />
                    </div>

                    <div className="w-full">
                      <Label>Signed Lease Agreement</Label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleChangeImageLease}
                        className="cursor-pointer"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end w-full">
                    <Button
                      // disabled={plotLength >= 5 ? true : false}
                      className="bg-white text-black h-[3rem] w-fit rounded-full my-4"
                      type="submit"
                    >
                      Reserve Now
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
