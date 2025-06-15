

'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Package, Loader2, CheckCircle2 } from 'lucide-react'

const CouponCodeCard = ({
  form,
  isValidatingCoupon,
  validateCoupon,
  couponError,
  couponData,
  discountAmount
}) => {
  return (
    <Card className="shadow-lg border-0 overflow-hidden">
      <div>
        <div className="bg-white rounded-t-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
            <CardTitle className="flex items-center gap-3 text-2xl text-gray-800">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                <Package className="w-5 h-5 text-purple-600" />
              </div>
              <span>كود الخصم</span>
            </CardTitle>
            <CardDescription className="text-gray-600">
              أدخل كود الخصم إذا كان لديك
            </CardDescription>
          </CardHeader>
        </div>
      </div>

      <CardContent className="p-8">
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="couponCode"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    placeholder="أدخل كود الخصم"
                    className="h-12 text-lg border-2 focus:border-purple-500 transition-colors"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <Button
            type="button"
            onClick={() => validateCoupon(form.getValues("couponCode"))}
            className="h-12 px-6 bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isValidatingCoupon ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "تطبيق"
            )}
          </Button>
        </div>

        {isValidatingCoupon && (
          <div className="mt-4 text-center">
            <Loader2 className="w-6 h-6 animate-spin mx-auto" />
            <p className="text-gray-600 mt-2">جاري التحقق من الكوبون...</p>
          </div>
        )}

        {couponError && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{couponError}</AlertDescription>
          </Alert>
        )}

        {couponData && (
          <Alert className="mt-4 bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              تم تطبيق الخصم بنجاح! {discountAmount} جنيه
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

export default CouponCodeCard



//  <Card className="shadow-lg border-0 overflow-hidden">
    //             <div>
    //               <div className="bg-white rounded-t-lg">
    //                 <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
    //                   <CardTitle className="flex items-center gap-3 text-2xl text-gray-800">
    //                     <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
    //                       <Package className="w-5 h-5 text-purple-600" />
    //                     </div>
    //                     <span>كود الخصم</span>
    //                   </CardTitle>
    //                   <CardDescription className="text-gray-600">
    //                     أدخل كود الخصم إذا كان لديك
    //                   </CardDescription>
    //                 </CardHeader>
    //               </div>
    //             </div>
    //             <CardContent className="p-8">
    //               <div className="flex gap-4">
    //                 <FormField
    //                   control={form.control}
    //                   name="couponCode"
    //                   render={({ field }) => (
    //                     <FormItem className="flex-1">
    //                       <FormControl>
    //                         <Input
    //                           placeholder="أدخل كود الخصم"
    //                           className="h-12 text-lg border-2 focus:border-purple-500 transition-colors"
    //                           {...field}
    //                         />
    //                       </FormControl>
    //                       <FormMessage className="text-red-500" />
    //                     </FormItem>
    //                   )}
    //                 />
    //                 <Button
    //                   type="button"
    //                   onClick={() =>
    //                     validateCoupon(form.getValues("couponCode"))
    //                   }
    //                   className="h-12 px-6 bg-purple-600 hover:bg-purple-700 text-white"
    //                 >
    //                   {isValidatingCoupon ? (
    //                     <Loader2 className="w-5 h-5 animate-spin" />
    //                   ) : (
    //                     "تطبيق"
    //                   )}
    //                 </Button>
    //               </div>

    //               {isValidatingCoupon && (
    //                 <div className="mt-4 text-center">
    //                   <Loader2 className="w-6 h-6 animate-spin mx-auto" />
    //                   <p className="text-gray-600 mt-2">
    //                     جاري التحقق من الكوبون...
    //                   </p>
    //                 </div>
    //               )}

    //               {couponError && (
    //                 <Alert variant="destructive" className="mt-4">
    //                   <AlertDescription>{couponError}</AlertDescription>
    //                 </Alert>
    //               )}

    //               {couponData && (
    //                 <Alert className="mt-4 bg-green-50 border-green-200">
    //                   <CheckCircle2 className="h-4 w-4 text-green-600" />
    //                   <AlertDescription className="text-green-800">
    //                     تم تطبيق الخصم بنجاح! {discountAmount} جنيه
    //                   </AlertDescription>
    //                 </Alert>
    //               )}
    //             </CardContent>
    //           </Card>