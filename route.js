import { connectDB } from '@/lib/mongodb.js';
import User from '@/lib/models/User.js';

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const { id } = params;

    const manufacturer = await User.findByIdAndDelete(id);

    if (!manufacturer) {
      return Response.json({
        success: false,
        message: 'Manufacturer not found'
      }, { status: 404 });
    }

    console.log('✅ Deleted:', manufacturer);

    return Response.json({
      success: true,
      message: 'Manufacturer deleted successfully'
    });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({
      success: false,
      message: error.message
    }, { status: 500 });
  }
}
