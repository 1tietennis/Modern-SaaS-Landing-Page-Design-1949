```javascript
import { supabaseService } from './supabaseService';

export class CheckoutOptimizationService {
  constructor() {
    this.optimizationTableName = 'checkout_optimization_crm2024';
    this.abTestsTableName = 'ab_tests_crm2024';
    this.heatmapsTableName = 'heatmaps_crm2024';
  }

  getDefaultFunnelData() {
    return [
      {
        name: 'Product View',
        visitors: 10000,
        conversionRate: 100,
        dropOffRate: 0,
        icon: 'FiEye'
      },
      {
        name: 'Add to Cart',
        visitors: 3500,
        conversionRate: 35,
        dropOffRate: 65,
        icon: 'FiShoppingCart'
      },
      {
        name: 'Checkout Start',
        visitors: 1750,
        conversionRate: 17.5,
        dropOffRate: 50,
        icon: 'FiCreditCard'
      },
      {
        name: 'Payment Info',
        visitors: 875,
        conversionRate: 8.75,
        dropOffRate: 50,
        icon: 'FiLock'
      },
      {
        name: 'Purchase Complete',
        visitors: 525,
        conversionRate: 5.25,
        dropOffRate: 40,
        icon: 'FiCheck'
      }
    ];
  }

  async getFunnelData() {
    try {
      const result = await supabaseService.getAll(this.optimizationTableName);
      return result.length > 0 ? result : this.getDefaultFunnelData();
    } catch (error) {
      console.error('Error getting funnel data:', error);
      return this.getDefaultFunnelData();
    }
  }
}

export const checkoutOptimizationService = new CheckoutOptimizationService();
export default checkoutOptimizationService;
```